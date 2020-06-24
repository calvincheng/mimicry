export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;


    this.user = {
      displayName: null,
      email: null,
      uid: null
    }

    this.session = {
      deckId: null,
      cardId: null,
      quality: 0,
//      cardsCorrect: 0,
//      cardsIncorrect: 0,
    }

    this.inputTimeout = null;
    this.input = '';

    this.initSpeechRecognition();

//    this.initOffline();

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in.

        // Populate user data
        this.user.displayName = user.displayName;
        this.user.email = user.email;
        this.user.emailVerified = user.emailVerified;
        this.user.uid = user.uid;

        let userData = await this.model.getUserData(user.uid);
        this.progress = userData.progress;

        console.log('Signed in');

        this.view.nav.querySelector('#logoutButton').hidden = false;
        this.view._bindLogoutButton(this.logoutUser);
 
        // Start cloze cards
        this.init();
        
      } else {
        // User is signed out.
        console.log('Signed out');
 
        this.view.nav.querySelector('#logoutButton').hidden = true;

        this.showLoginCard();
 
      }
    });
  }


  signupUser = (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => { this.model.signup(userCredential.user) })
      .catch((error) => {
        let message;
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'The email address is already registered.'
            this.view.raiseSignupError(message, true, false);
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            this.view.raiseSignupError(message, true, false);
            break;
          case 'auth/wrong-password':
            message = 'Invalid password. Please try again.';
            this.view.raiseSignupError(message, false, true);
            break;
          case 'auth/weak-password':
            message = 'The password must be at least 6 characters long.';
            this.view.raiseSignupError(message, false, true);
            break;
          default:
            this.view.raiseSignupError(error.message, true, true);
        }
        console.log(error.code);
        console.log(error.message);
      });
  }

  loginUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then( user => console.log(user) )
      .catch((error) => {
        let message;
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'No account registered under this email.'
            this.view.raiseLoginError(message, true, false);
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            this.view.raiseLoginError(message, true, false);
            break;
          case 'auth/wrong-password':
            message = 'Invalid password. Please try again.';
            this.view.raiseLoginError(message, false, true);
            break;
          default:
            this.view.raiseLoginError(error.message, true, true);
        }
        console.log(error.code);
        console.log(error.message);
      });
  }

  recoverUserPassword = (email) => {
    firebase.auth().sendPasswordResetEmail(email)
      .then( () => this.showForgotPasswordSuccessCard() )
      .catch((error) => {
        let message;
        switch (error.code) {
          case 'auth/user-not-found':
            message = 'No account registered under this email.'
            this.view.raiseForgotPasswordError(message);
            break;
          case 'auth/invalid-email':
            message = 'Please enter a valid email address.';
            this.view.raiseForgotPasswordError(message);
            break;
          default:
            this.view.raiseLoginError(error.message);
        }
        console.log(error.code);
        console.log(error.message);
      });
  }

  logoutUser = () => {
    firebase.auth().signOut()
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  }

  showLoginCard = () => {
    this.view._clearWindow();

    this.view.showLoginCard();
    this.view._bindLoginButton(this.loginUser);
    this.view._bindSignupButton(this.showSignupCard);
    this.view._bindForgotPasswordLink(this.showForgotPasswordCard);

    this.deafen();
  }

  showForgotPasswordCard = () => {
    this.view._clearWindow();
    this.view.showForgotPasswordCard();
    this.view._bindSendPasswordResetButton(this.recoverUserPassword);
    this.view._bindBackToLoginButton(this.showLoginCard);
  }

  showForgotPasswordSuccessCard = () => {
    this.view._clearWindow();
    this.view.showForgotPasswordSuccessCard();
    this.view._bindBackToLoginButton(this.showLoginCard);
  }

  showSignupCard = () => {
    this.view._clearWindow();
    this.view.showSignupCard();
    this.view._bindBackToLoginButton(this.showLoginCard);
    this.view._bindCreateAccountButton(this.signupUser);
  }

  showClozeCard = (card) => {
    this.view._clearWindow();

    this.currentCard = card;

    this.view.showClozeCard(card);
    this.view._bindMicrophoneButton(this.startSpeechRecognition);
    this.view._bindSpeakButton(this.speakPhrase);

    this.input = '';
    // this.listen();
  }

  showFinishedCard = () => {
    this.view._clearWindow();
    this.view.showFinishedCard(); 
  }

  init = async () => {
    // Get deckId from firebase.auth() and firebase.database()
    firebase.database().ref('/users/' + firebase.auth().currentUser.uid + '/deck')
      .once('value')
      .then(async (data) => {
        this.session.deckId = data.val()
        this.dueCardIds = await this.model.getDueCardIds(this.session.deckId);
        this.nextCard();
      });
  }

  initOffline = async () => {
    this.session.deckId = 1234;
    this.dueCardIds = await this.model.getDueCardIdsOffline(this.session.deckId);
    console.log(this.dueCardIds);
    this.nextCard();
  }

  nextCard = async () => {
    // Reset some stats
    this.session.quality = 5;

    let cardId;
    let isNewCard = false;
    // Revise due cards if available, otherwise study new cards
    if (this.dueCardIds.length > 0) {
      cardId = this.dueCardIds.pop(); 
    } else {
      cardId = this.progress;
      isNewCard = true;
    }
    this.session.cardId = cardId;

    const card = await this.model.getCard(cardId);

    // Add card information to user deck if it's new and it exists
    if (card && isNewCard) {
      this.progress += 1;
      this.model.updateUserProgress(this.user.uid, this.progress);
      this.model.addCardToUserDeck(cardId, this.session.deckId); 
    }

    card ? this.showClozeCard(card) : this.showFinishedCard();
  }

  updateCard = (cardId, deckId, quality) => {
    this.model.updateCard(cardId, deckId, quality);
  }

  initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      let speechRecognition = webkitSpeechRecognition;
      this.recognition = new speechRecognition();
      this.recognition.continuous = false; // false: ends when speaking stops
      this.recognition.interimResults = true;
      this.recognition.lang = 'fr-FR';

      this.recognition.onstart = () => {
        console.log('Speech recognition: ON');
        this.input = '';
      };

      this.recognition.onresult = (event) => {
        console.log(event.results[0][0].confidence);
        if (event.results[0][0].confidence >= 0.6) {
          this.input = event.results[0][0].transcript;
          this.insertClozeWord();
          const result = this.checkInput();
          this.view._highlightWords(result.correctIdxs);
        }
        console.log(this.input);
      }

      this.recognition.onspeechend = (event) => {
        console.log('Speech recognition: OFF');
        this.recognition.stop();
      };

      this.recognition.onend = (event) => {
        console.log('FINAL INPUT:', this.input);
        this.view.toggleRecordingAnimation();
        setTimeout(this.confirmInput, 400);
//        this.confirmInput();
      }
    } else {
      console.log('Mimicry not supported on this browser. Please use Google Chrome instead.');
    }
  }

  startSpeechRecognition = () => {
    this.view.toggleRecordingAnimation();
    this.recognition.start();
  }

  listen() {
    // Listen for keyboard input -- FOR TESTING
    document.addEventListener('keydown', this.readInput);
  }

  deafen() {
    // Stop listening for keyboard input -- FOR TESTING
    document.removeEventListener('keydown', this.readInput);
  }
  
  readInput = (event) => {
    // Used for keyboard input -- FOR TESTING

    // Ensure input is valid (alphanumeric or backspace)
    const alphanum = /^[a-zA-Z0-9!\.\,\' ]$/;
    if (!event.key.match(alphanum) && !event.key == 'Backspace') return;

    if (event.key.match(alphanum)) {

      this.input += event.key;

    } else if (event.key === 'Backspace') {

      event.preventDefault(); // Stop going to previous page

      // Remove last character
      this.input = this.input.slice(0, -1);
    }

    // Check if input matches card
    const result = this.checkInput();

    // Update view
    this.view._highlightWords(result.correctIdxs);

    // Reset confirm timeout
    if (this.inputTimeout) clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(this.confirmInput, 1000);

    console.log(this.input);
  }

  insertClozeWord = () => {
    const targetWords = this.currentCard.fr.split(' ');
    const inputWords = this.input.trim().split(' ');

    // Find index of cloze word in targetPhrase
    let index;
    for (let i = 0; i < targetWords.length; i++) {
      const word = targetWords[i];
      if (word.includes('{')) {
        index = i;
        break;
      }
    }

    // Return if input doesn't have enough words to match cloze
    if (index >= inputWords.length) return;

    // Mark the index-th word in input as cloze word
    const clozeWord = inputWords[index];
    const capitalise = index === 0;
    this.view.showCloze(clozeWord, capitalise);
  }

  checkInput = () => {
    const removeBrackets = /[\{\}]/g;

    const inputWords = this.input.trim().split(' ');
    let targetWords = this.currentCard.fr.replace(removeBrackets, '').split(' ');
    
    let skip = 0; // For offsetting word comparison (i.e. skip = 1 --> input[2] vs target[3])
    let correct = true;
    let correctIdxs = [];
    for (let i = 0; i < targetWords.length; i++) {
      const removePunc = /[\,\.]/g;
      const inputWord = inputWords[i-skip] ? inputWords[i-skip].replace(removePunc, '') : null;
      const targetWord = targetWords[i].replace(removePunc, '');
      
      const checkPunc = /[\!\?\«\»]/;
      if (targetWord.match(checkPunc)) {
        // Target is a special punctuation mark following a correct word
        if (correctIdxs.includes(i - 1)) correctIdxs.push(i);
        skip += 1;
      } else if (inputWord && inputWord.toLowerCase() === targetWord.toLowerCase()) {
        // Input matches target
        correctIdxs.push(i);
      } else {
        // Incorrect word
        correct = false;
      }
    }

    const result = {
      correctIdxs: correctIdxs, 
      correct: correct,
    }

    return result;
  }

  _removeAccents(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  confirmInput = () => {
    const result = this.checkInput();
//    this.deafen();

    if (result.correct) { 
      this.view._confirm('correct');

      setTimeout(() => {
        // Set SM2 stats and show next card
        this.model.updateCard(
          this.session.cardId, 
          this.session.deckId, 
          this.session.quality
        );

        this.nextCard()
      }, 1000);
    } else {
      this.view._confirm('incorrect')

      if (this.session.quality === 5) this.session.quality = 2;

      setTimeout(() => {
        this.view.hideCloze();
        this.view._removeHighlights();
        this.input = '';
        // this.listen();
      }, 1500);
    }
  }

  speakPhrase = async (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'fr-FR';

    if (speechSynthesis.getVoices().length > 0) {
      // Speech synthesis is ready (i.e. voices loaded)

      // [3]: Amelie fr-CA, [37]: Thomas fr-FR, [53]: Google français fr-FR
      utterance.voice = speechSynthesis.getVoices()[53]; 
      speechSynthesis.speak(utterance);

      // Clear utterance queue after speaking in case of spammed button
      utterance.onend = () => { speechSynthesis.cancel() };
    } else {
      // Add event listener to call speakPhrase again when ready
      console.log('Waiting for voices to populate');
      speechSynthesis.addEventListener('voiceschanged', (event) => {
        this.speakPhrase(phrase);
      });
    }
  }
}
