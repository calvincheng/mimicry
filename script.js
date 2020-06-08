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
    this.data = {};
  }

  login(token) {
    db.ref('/' + token).once('value')
      .then( (snapshot) => this.data = snapshot.val() );
  }
}

class View {
  constructor() {
    this.showLoginCard();
  }

  showLoginCard() {
    const loginCard = document.createElement('div');
    loginCard.className = 'card';
    
    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Log in to Mimicry';

    const emailField = this._makeField('text', 'Email', 'emailField');
    const passwordField = this._makeField('password', 'Password', 'passwordField');

    const loginButton = document.createElement('button');
    loginButton.id = 'loginButton';
    loginButton.className = 'button';
    loginButton.innerText = 'Log in';
    loginButton.style.width = '100%';
    loginButton.style.marginTop = 1 + 'rem';

    const signupButton = document.createElement('button');
    signupButton.id = 'signupButton';
    signupButton.className = 'button secondary';
    signupButton.innerText = 'Sign up';
    signupButton.style.width = '100%';
    signupButton.style.marginTop = 0.8 + 'rem';

    const forgotPwdWrapper = document.createElement('div');
    forgotPwdWrapper.style.textAlign = 'center';
    forgotPwdWrapper.style.margin = '3rem auto -1rem auto';

    const forgotPwdText = document.createElement('a');
    forgotPwdText.href = '#';
    forgotPwdText.innerText = 'Forgot password?'

    forgotPwdWrapper.append(forgotPwdText);

    loginCard.append(
      cardTitle, 
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
    signupCard.className = 'card';
    
    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Sign up to Mimicry';

    const emailField = this._makeField('text', 'Email', 'emailField');
    const passwordField = this._makeField('password', 'Password', 'passwordField');
    const passwordConfirmField = this._makeField('password', 'Retype password', 'passwordConfirmField');

    const createAccountButton = document.createElement('button');
    createAccountButton.id = 'createAccountButton';
    createAccountButton.className = 'button';
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
    logoutCard.className = 'card';
    
    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Log out';

    const userInfo = document.createElement('p');
    userInfo.innerHTML = user.email;

    const logoutButton = document.createElement('button');
    logoutButton.id = 'logoutButton';
    logoutButton.className = 'button';
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
        this.raiseSignupError('differentPasswords');
        return;
      }

      // Create user on Firebase Auth with submitted email/password
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(handler())
        .catch( (error) => {
          let errorCode = error.code;
          let errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    });
  }

  _bindLogoutButton(handler) {
    this.logoutCard.addEventListener('click', (event) => {
      if (event.target.id !== 'logoutButton') return;

      event.target.blur();

      handler();

    });
  }

  raiseSignupError(type) {
    switch (type) {
      case 'differentPasswords':
        let pwdField = document.getElementById('passwordField');
        document.getElementById('passwordField')
          .parentElement.classList.add('field-failure');
        document.getElementById('passwordConfirmField')
          .parentElement.classList.add('field-failure');
        break;
    }
  }

  _makeField(type = 'text', labelText = '', id = '') {
    // Helper function to make input field
    // TODO: Object argument instead

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.placeholder = ' ';

    const label = document.createElement('label');
    label.innerText = labelText;

    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'field-group';
    fieldGroup.append(input, label);

    return fieldGroup;
  }

  _clearWindow() {
    document.body.innerHTML = '';
  }
}

let timeout;

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    firebase.auth().onAuthStateChanged((user) => {
      // TODO: Add debouncing
      clearTimeout(timeout);

      timeout = setTimeout(() => {
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
      }, 200);
    });
  }

  loginUser = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch( (error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  }

  logoutUser = () => {
    firebase.auth().signOut()
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
      });
  }

  createAccount = () => {
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
    this.view._bindCreateAccountButton(this.createAccount);
  }

  showLogoutCard = (user) => {
    this.view._clearWindow();
    this.view.showLogoutCard(user);
    this.view._bindLogoutButton(this.logoutUser);
  }

}

const app = new Controller(new Model, new View);







