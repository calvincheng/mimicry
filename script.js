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

import { config } from './config.js';
let firebaseConfig = config.firebase;
firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();
let provider = new firebase.auth.GoogleAuthProvider();

let db = firebase.database();

// ----------------------------

class Model {
  constructor() {
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
//               interval: 1,
//               easiness: 0,
//             }
//           ],
//         }
//       },
  }

// /(\{[^\]]*\})/

  _getBracketedWords(string) {
    // Helper function -- returns an array of bracketed words
    // e.g. "{Hello} world" returns [Hello]
    const pattern = /(\{[^\]]*\})/g; // g -- global flag
    const words = string.match(pattern);

    // Remove brackets
    words = words.map( word => word.slice(1, -1) );

    return words
  }

  

  login(user) {
    // Gets user information for app
    db.ref('/' + token).once('value')
      .then( (snapshot) => this.data = snapshot.val() );
  }

  signup(user) {
    const data = {
      email: user.email,
      creationTime: new Date().toJSON(),
      progress: 0,
      deck: user.uid,
    };
    db.ref('users/' + user.uid).set(data);
  }
}

class View {
  constructor() {
    this.showNavbar();
    this.showLoginCard();
  }

  showNavbar() {
    // Create basic nav element
    const nav = document.createElement('nav');

    // Create logo and add to nav
    const logo = document.createElement('img');
    logo.className = 'nav-logo';
    logo.src = './assets/svg/logo_dark.svg';
    logo.ondragstart = () => {return false};

    nav.append(logo);

    document.body.prepend(nav);
  }

  showLoginCard() {
    const loginCard = document.createElement('div');
    loginCard.className = 'card dp1 centered';
    
    // Add title
    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Log in to Mimicry';

    // Add error message
    const errorMessageWrapper = document.createElement('div');
    errorMessageWrapper.className = 'error-wrapper';
    errorMessageWrapper.style.visibility = 'hidden';

    const errorMessage = document.createElement('p');
    errorMessage.className = 'error';
    errorMessage.innerText = 'Error';

    errorMessageWrapper.append(errorMessage);

    // Add input fields
    const emailField = this._makeField('text', 'Email', 'emailField');
    const passwordField = this._makeField('password', 'Password', 'passwordField');

    const loginButton = document.createElement('button');
    loginButton.id = 'loginButton';
    loginButton.className = 'button primary';
    loginButton.innerText = 'Log in';
    loginButton.style.width = '100%';
    loginButton.style.marginTop = 1 + 'rem';

    // Add buttons
    const signupButton = document.createElement('button');
    signupButton.id = 'signupButton';
    signupButton.className = 'button secondary';
    signupButton.innerText = 'Sign up';
    signupButton.style.width = '100%';
    signupButton.style.marginTop = 0.8 + 'rem';

    // Add forgot password link
    const forgotPwdWrapper = document.createElement('div');
    forgotPwdWrapper.style.textAlign = 'center';
    forgotPwdWrapper.style.margin = '3rem auto -1rem auto';

    const forgotPwdText = document.createElement('a');
    forgotPwdText.href = '#';
    forgotPwdText.innerText = 'Forgot password?'

    forgotPwdWrapper.append(forgotPwdText);

    // Append all components to card
    loginCard.append(
      cardTitle, 
      errorMessageWrapper,
      emailField, 
      passwordField, 
      loginButton, 
      signupButton, 
      forgotPwdWrapper
    );

    this.loginCard = loginCard;

    document.body.append(loginCard);
  }

  showSignupCard() {
    const signupCard = document.createElement('div');
    signupCard.className = 'card dp1 centered';
    
    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Sign up to Mimicry';

    // Add error message
    const errorMessageWrapper = document.createElement('div');
    errorMessageWrapper.className = 'error-wrapper';
    errorMessageWrapper.style.visibility = 'hidden';

    const errorMessage = document.createElement('p');
    errorMessage.className = 'error';
    errorMessage.innerText = 'Error';

    errorMessageWrapper.append(errorMessage);

    const emailField = this._makeField('text', 'Email', 'emailField');
    const passwordField = this._makeField('password', 'Password', 'passwordField');
    const passwordConfirmField = this._makeField('password', 'Retype password', 'passwordConfirmField');

    const createAccountButton = document.createElement('button');
    createAccountButton.id = 'createAccountButton';
    createAccountButton.className = 'button primary';
    createAccountButton.innerText = 'Create account';
    createAccountButton.style.width = '100%';
    createAccountButton.style.marginTop = 1 + 'rem';

    const backButton = document.createElement('button');
    backButton.id = 'backToLoginButton';
    backButton.className = 'button secondary';
    backButton.innerText = 'Back';
    backButton.style.width = '100%';
    backButton.style.marginTop = 0.8 + 'rem';

    signupCard.append(
      cardTitle, 
      errorMessageWrapper,
      emailField, 
      passwordField, 
      passwordConfirmField, 
      createAccountButton, 
      backButton
    );

    this.signupCard = signupCard;

    document.body.append(signupCard);
  }

  showLogoutCard(user) {
    const logoutCard = document.createElement('div');
    logoutCard.className = 'card dp1 centered';
    
    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Log out';

    const userInfo = document.createElement('p');
    userInfo.style.wordBreak = 'break-all';
    //user.getIdToken().then((token) => userInfo.innerText = token);
    userInfo.innerText = user.email;

    const logoutButton = document.createElement('button');
    logoutButton.id = 'logoutButton';
    logoutButton.className = 'button primary';
    logoutButton.innerText = 'Log out';
    logoutButton.style.width = '100%';
    logoutButton.style.marginTop = 1 + 'rem';

    logoutCard.append(
      cardTitle, 
      userInfo,
      logoutButton, 
    );

    this.logoutCard = logoutCard;

    document.body.append(logoutCard);
  }

  _bindSignupButton(handler) {
    this.loginCard.addEventListener('click', (event) => {
      if (event.target.id !== 'signupButton') return;
      event.target.blur();
      handler();
    });
  }

  _bindLoginButton(handler) {
    this.loginCard.addEventListener('click', (event) => {
      if (event.target.id !== 'loginButton') return;

      event.target.blur();

      let email = document.getElementById('emailField').value;
      let password = document.getElementById('passwordField').value;

      handler(email, password)

    });
  }

  _bindBackButton(handler) {
    this.signupCard.addEventListener('click', (event) => {
      if (event.target.id !== 'backToLoginButton') return;
      event.target.blur();
      handler();
    });
  }

  _bindCreateAccountButton(handler) {
    this.signupCard.addEventListener('click', (event) => {
      if (event.target.id !== 'createAccountButton') return;

      event.target.blur();

      let email = document.getElementById('emailField').value;
      let password = document.getElementById('passwordField').value;
      let passwordConfirm = document.getElementById('passwordConfirmField').value;

      // Stop sign-up process if passwords don't match
      if (password !== passwordConfirm) {
        let errorMessage = 'The passwords do not match.'
        this.raiseSignupError(errorMessage, false, true);
        return;
      }

      handler(email, password);

    });
  }

  _bindLogoutButton(handler) {
    this.logoutCard.addEventListener('click', (event) => {
      if (event.target.id !== 'logoutButton') return;

      event.target.blur();

      handler();

    });
  }

  raiseLoginError(message, highlightEmailField, highlightPasswordField) {
    const emailField = document.getElementById('emailField');
    const passwordField = document.getElementById('passwordField');

    // Reset form styles
    emailField.parentElement.classList.remove('field-failure');
    passwordField.parentElement.classList.remove('field-failure');

    // Display error message
    this.loginCard.querySelector('.error-wrapper').style.visibility = 'visible';
    this.loginCard.querySelector('.error').innerText = message;

    // Change specified input fields to error state if specified
    if (highlightEmailField) {
      emailField.parentElement.classList.add('field-failure');
    }
    if (highlightPasswordField) {
      passwordField.parentElement.classList.add('field-failure');
    }
  }

  raiseSignupError(message, highlightEmailField, highlightPasswordField) {
    const emailField = document.getElementById('emailField');
    const passwordField = document.getElementById('passwordField');
    const passwordConfirmField = document.getElementById('passwordConfirmField');

    // Reset form styles
    emailField.parentElement.classList.remove('field-failure');
    passwordField.parentElement.classList.remove('field-failure');
    passwordConfirmField.parentElement.classList.remove('field-failure');

    // Display error message
    document.querySelector('.error-wrapper').style.visibility = 'visible';
    document.querySelector('.error').innerText = message;

    // Change specified input fields to error state if specified
    if (highlightEmailField) {
      emailField.parentElement.classList.add('field-failure');
    }
    if (highlightPasswordField) {
      passwordField.parentElement.classList.add('field-failure');
      passwordConfirmField.parentElement.classList.add('field-failure');
    }
  }

  _makeField(type = 'text', labelText = '', id = '') {
    // Helper function to make input field
    // TODO: Object argument instead

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = ' ';
    input.autocomplete = 'off'; // chrome autocomplete styling is grotesque, temp fix

    const label = document.createElement('label');
    label.innerText = labelText;

    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'field-group';
    fieldGroup.append(input, label);

    return fieldGroup;
  }

  _clearWindow() {
    // Clear everything but the nav
    let nav  = document.querySelector('nav');
    while (nav.nextSibling) {
      nav.nextSibling.remove();
    }
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        let displayName = user.displayName;
        let email = user.email;
        let emailVerified = user.emailVerified;
        let photoURL = user.photoURL;
        let uid = user.uid;
        console.log('Signed in');

        this.showLogoutCard(user);
        
      } else {
        // User is signed out.
        console.log('Signed out');

        this.showLoginCard();

      }
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
          default:
            this.view.raiseSignupError(error.message, true, true);
        }
        console.log(error.code);
        console.log(error.message);
      });
  }

  showLoginCard = () => {
    this.view._clearWindow();
    this.view.showLoginCard();
    this.view._bindLoginButton(this.loginUser);
    this.view._bindSignupButton(this.showSignupCard);
  }

  showSignupCard = () => {
    this.view._clearWindow();
    this.view.showSignupCard();
    this.view._bindBackButton(this.showLoginCard);
    this.view._bindCreateAccountButton(this.signupUser);
  }

  showLogoutCard = (user) => {
    this.view._clearWindow();
    this.view.showLogoutCard(user);
    this.view._bindLogoutButton(this.logoutUser);
  }

}

const app = new Controller(new Model, new View);
app.view._clearWindow();





