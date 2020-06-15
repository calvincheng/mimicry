export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    const uid = 1234;
    this.progress = this.model.db.users[uid].progress;//0; // TODO: Set to user.progress

    this.session = {
      cardsCorrect: 0,
      cardsIncorrect: 0,
    }

    this.inputTimeout = null;
    this.input = '';

    this.nextCard();

//     firebase.auth().onAuthStateChanged((user) => {
//       if (user) {
//         // User is signed in.
//         let displayName = user.displayName;
//         let email = user.email;
//         let emailVerified = user.emailVerified;
//         let photoURL = user.photoURL;
//         let uid = user.uid;
//         console.log('Signed in');
// 
//         this.init();
//         
//       } else {
//         // User is signed out.
//         console.log('Signed out');
// 
//         this.showLoginCard();
// 
//       }
//     });
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
    this.view.nav.querySelector('#logoutButton').hidden = true;

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

    this.view.nav.querySelector('#logoutButton').hidden = false;
    this.view._bindLogoutButton(this.logoutUser);

    this.currentCard = card;

    this.view.showClozeCard(card);
    this.view._bindSpeakButton(this.speakPhrase);

    this.input = '';
    this.listen();
  }

  nextCard = async () => {
    // let card = await this.model.getCard(this.progress);
    const cardId = this.progress;
    const deckId = 1234;

    // Reset some stats
    this.quality = 5;
    clearTimeout(this.inputTimeout);

    this.model.addCardToUserDeckOffline(cardId, deckId); // ideally move method to model when model gets user due/new cards

    let card = await this.model.getCardOffline(cardId);
    this.showClozeCard(card);
  }

  updateCard = (cardId, deckId, quality) => {
    
  }

  listen() {
    document.addEventListener('keydown', this.readInput);
  }

  deafen() {
    document.removeEventListener('keydown', this.readInput);
  }
  
  readInput = (event) => {
    // Ensure input is valid (alphanumeric or backspace)
    const alphanum = /^[a-zA-Z0-9!\.\,\' ]$/;
    if (!event.key.match(alphanum) && !event.key == 'Backspace') return;

    if (event.key.match(alphanum)) {

      this.input += event.key;

    } else if (event.key === 'Backspace') {

      event.preventDefault(); // Stop going to previous page

      // Remove last character
      this.input = this.input.slice(0, -1);

      // Clear previous timeout and reset timeout for confirming input
    }

    // Check if input matches card
    const result = this.checkInput();

    // Update view
    this.view._highlightWords(result.correctIdxs);

//    console.log('cleared');
    if (this.inputTimeout) clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(this.confirmInput, 1500);

    console.log(this.input);
  }

  checkInput = () => {
    const removeBrackets = /[\{\}]/g;

    const inputWords = this.input.trim().split(' ');
    let targetWords = this.currentCard.fr.replace(removeBrackets, '').split(' ');
    
    // Remove accents (TODO: hopefully remove when inputs can have accents)
    targetWords = targetWords.map( word => this._removeAccents(word));

    let skip = 0; // For offsetting word comparison (i.e. skip = 1 --> input[2] vs target[3])
    let correct = true;
    let correctIdxs = [];
    for (let i = 0; i < targetWords.length; i++) {
      const removePunc = /[\,\.]/g;
      const inputWord = inputWords[i-skip] ? inputWords[i-skip].replace(removePunc, '') : null;
      const targetWord = targetWords[i].replace(removePunc, '');
      
      const checkPunc = /[\!\«\»]/;
      
      // If input matches target, OR 
      // target is a special punctuation mark following a correct word
      if (targetWord.match(checkPunc) && correctIdxs.includes(i - 1)) {
        correctIdxs.push(i);
        skip += 1;
      } else if (inputWord && inputWord.toLowerCase() === targetWord.toLowerCase()) {
        correctIdxs.push(i);
      } else {
        correct = false;
      }
    }

    const result = {
      correctIdxs: correctIdxs, 
      correct: correct
    }

    return result;
  }

  _removeAccents(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  confirmInput = () => {
    const result = this.checkInput();
    this.deafen();

    if (result.correct) { 
      this.view._confirm('correct');

      this.progress += 1; /* TODO: Set to user.progress */

      setTimeout(() => {
        this.nextCard()
      }, 1000);
    } else {
      this.view._confirm('incorrect')

      if (this.quality === 5) this.quality = 3;

      setTimeout(() => {
        this.view._removeHighlights()
        this.input = ''
        this.listen();
      }, 1500);
    }
  }

  speakPhrase = async (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'fr-FR';

    if (speechSynthesis.getVoices().length > 0) {
      // 3: Amelie fr-CA, 37: Thomas fr-FR, 53: Google français fr-FR
      utterance.voice = speechSynthesis.getVoices()[53]; 
      speechSynthesis.speak(utterance);

      // Clear utterance queue after speaking in case of spammed button
      utterance.onend = () => { speechSynthesis.cancel() };
    } else {
      // If voices haven't loaded yet, add event listener to 
      // call speakPhrase again when ready
      console.log('Waiting for voices to populate');
      speechSynthesis.addEventListener('voiceschanged', (event) => {
        this.speakPhrase(phrase);
      });
    }
  }

}
