'use strict'
// const signInButton = document.getElementById('signInButton');
// 
// signInButton.addEventListener('click', (e) => {
//   auth.signInWithPopup(provider)
//     .then( (result) => {
//       let token = result.credential.accessToken;
//       let user = result.user;
//       console.log(result);
//     })
//     .catch( (error) => {
//       console.log(error.code, error.message);
//     });
// });

//       users: {
//         userId: {
//           name: "Calvin Cheng",
//           email: "calvin.cc.cheng@gmail.com",
//           progress: 4, // 4th word
//           deck: deckId,
//         },
//       },
// 
//       cards: {
//         cardId: {
//           fr: "{Bonjour}! Je m'appelle Frederick.",
//           en: "{Hello}! My name is Frederick."
//         },
//       },
// 
//       decks: {
//         deckId: {
//           owner: userId,
//           cards: [
//             {
//               id: cardId,
//               repetitions: 0,
//               interval: 1, // in days
//               easiness: 0,
//             }
//           ],
//         }
//       },
//
import { config } from './config.js';
let firebaseConfig = config.firebase;
firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();
let provider = new firebase.auth.GoogleAuthProvider();

// ----------------------------

import { View } from './View.js';
import { Model } from './Model.js';

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.input = '';

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        let displayName = user.displayName;
        let email = user.email;
        let emailVerified = user.emailVerified;
        let photoURL = user.photoURL;
        let uid = user.uid;
        console.log('Signed in');

        this.showClozeCard();
        
      } else {
        // User is signed out.
        console.log('Signed out');

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

    this.deafen();
  }

  showSignupCard = () => {
    this.view._clearWindow();
    this.view.showSignupCard();
    this.view._bindBackButton(this.showLoginCard);
    this.view._bindCreateAccountButton(this.signupUser);
  }

  showClozeCard = async () => {
    this.view._clearWindow();
    this.view.nav.querySelector('#logoutButton').hidden = false;
    this.view._bindLogoutButton(this.logoutUser);

    // const card = await this.model.getCard();
    const card = {fr: "{Merci}, Monsieur", en: "{Thank you}, sir!"}

    this.view.showClozeCard(card);
    this.view._bindSpeakButton(this.speakPhrase);

    this.input = '';
    this.listen();
  }

  listen() {
    document.addEventListener('keydown', this.fillInput);
  }

  deafen() {
    document.removeEventListener('keydown', this.fillInput);
  }

  fillInput = (event) => {
    const alphanum = /^[a-zA-Z0-9!\.\,\' ]$/;
    if (!event.key.match(alphanum) && !event.key === 'Backspace') return;

    if (event.key.match(alphanum)) {
      this.input += event.key;
    } else if (event.key === 'Backspace') {
      // Remove last character
      this.input = this.input.slice(0, -1);
    }
    this.view._updateClozeCard(this.input);
    console.log(this.input);
  }

  speakPhrase = async (phrase) => {
    const utterance = new SpeechSynthesisUtterance(phrase);
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

const app = new Controller(new Model, new View);


