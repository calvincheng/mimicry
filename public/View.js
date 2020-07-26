export class View {
  constructor() {
    this.showNavbar();
  }

  showNavbar() {
    // Create basic nav element
    const nav = document.createElement('nav');

    // Create logo and add to nav
    const logo = document.createElement('span');
    logo.className = 'nav-logo';
    logo.innerText = 'MIMICRY';

    // Create nav links
    const navLinks = document.createElement('ul');

    const signoutNavLink = document.createElement('li');

    const signoutLink = document.createElement('a');
    signoutLink.id = 'logoutButton';
    signoutLink.innerText = 'Sign out';

    signoutLink.hidden = true;

    signoutNavLink.append(signoutLink);
    navLinks.append(signoutNavLink);

    nav.append(logo, navLinks);

    this.nav = nav;

    document.body.prepend(nav);
  }

  showLoginCard() {
    const loginCard = document.createElement('div');
    loginCard.className = 'card dp1 centered';
    
    // Add title
    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Log in to Mimicry';

    // Add error message
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error';
    errorMessage.innerText = 'Error';
    errorMessage.style.visibility = 'hidden';
    errorMessage.style.marginBottom = 1.5 + 'rem';

    // Add input fields
    const emailField = this._makeField('text', 'Email', 'emailField');
    const passwordField = this._makeField('password', 'Password', 'passwordField');

    // Add buttons
    const loginButton = document.createElement('button');
    loginButton.id = 'loginButton';
    loginButton.className = 'button green';
    loginButton.innerText = 'Log in';
    loginButton.style.width = '100%';
    loginButton.style.marginTop = 1 + 'rem';

    const signupButton = document.createElement('button');
    signupButton.id = 'signupButton';
    signupButton.className = 'button yellow';
    signupButton.innerText = 'Sign up';
    signupButton.style.width = '100%';
    signupButton.style.marginTop = 0.8 + 'rem';

    // Bind enter key event to login button
    emailField.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        loginButton.click();
      }
    });

    passwordField.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        loginButton.click();
      }
    });

    // Add forgot password link
    const forgotPasswordWrapper = document.createElement('div');
    forgotPasswordWrapper.style.textAlign = 'center';
    forgotPasswordWrapper.style.margin = '3rem auto -1rem auto';

    const forgotPasswordLink = document.createElement('a');
    forgotPasswordLink.id = 'forgotPasswordLink';
    forgotPasswordLink.innerText = 'Forgot password?';

    forgotPasswordWrapper.append(forgotPasswordLink);

    // Append all components to card
    loginCard.append(
      cardTitle, 
      errorMessage,
      emailField, 
      passwordField, 
      loginButton, 
      signupButton, 
      forgotPasswordWrapper
    );

    this.currentCard = loginCard;

    document.body.append(loginCard);
  }

  showForgotPasswordCard() {
    const forgotPasswordCard = document.createElement('div');
    forgotPasswordCard.className = 'card dp1 centered';

    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Reset password';

    // Add description
    const description = document.createElement('p');
    description.innerText = 'We\'ll send you a link to reset your password.';
    description.style.marginBottom = 1.5 + 'rem';

    // Add error message
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error';
    errorMessage.innerText = 'Error';
    errorMessage.style.visibility = 'hidden';
    errorMessage.style.marginBottom = 1.5 + 'rem';
    
    // Add email field
    const emailField = this._makeField('text', 'Email', 'emailField');

    // Add buttons
    const sendButton = document.createElement('button');
    sendButton.id = 'sendButton';
    sendButton.className = 'button green';
    sendButton.innerText = 'Send';
    sendButton.style.width = '100%';
    sendButton.style.marginTop = 1 + 'rem';

    const backButton = document.createElement('button');
    backButton.id = 'backToLoginButton';
    backButton.className = 'button yellow';
    backButton.innerText = 'Back';
    backButton.style.width = '100%';
    backButton.style.marginTop = 0.8 + 'rem';

    // Append all components to card
    forgotPasswordCard.append(
      cardTitle, 
      description,
      errorMessage,
      emailField, 
      sendButton, 
      backButton, 
    );

    this.currentCard = forgotPasswordCard;

    document.body.append(forgotPasswordCard);
  }

  showForgotPasswordSuccessCard() {
    const forgotPasswordSuccessCard = document.createElement('div');
    forgotPasswordSuccessCard.className = 'card dp1 centered';

    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Success';

    const message = document.createElement('p');
    message.innerText = 'Your password reset link has been emailed.';

    const backButton = document.createElement('button');
    backButton.id = 'backToLoginButton';
    backButton.className = 'button green';
    backButton.innerText = 'Back';
    backButton.style.width = '100%';
    backButton.style.marginTop = 1.5 + 'rem';

    forgotPasswordSuccessCard.append(
      cardTitle,
      message,
      backButton,
    );

    this.currentCard = forgotPasswordSuccessCard;

    document.body.append(forgotPasswordSuccessCard);
  }

  showSignupCard() {
    const signupCard = document.createElement('div');
    signupCard.className = 'card dp1 centered';
    
    const cardTitle = document.createElement('h2');
    cardTitle.innerText = 'Sign up to Mimicry';

    // Add error message
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error';
    errorMessage.innerText = 'Error';
    errorMessage.style.visibility = 'hidden';
    errorMessage.style.marginBottom = 1.5 + 'rem';

    const emailField = this._makeField('text', 'Email', 'emailField');
    const passwordField = this._makeField('password', 'Password', 'passwordField');
    const passwordConfirmField = this._makeField('password', 'Retype password', 'passwordConfirmField');

    const createAccountButton = document.createElement('button');
    createAccountButton.id = 'createAccountButton';
    createAccountButton.className = 'button green';
    createAccountButton.innerText = 'Create account';
    createAccountButton.style.width = '100%';
    createAccountButton.style.marginTop = 1 + 'rem';

    const backButton = document.createElement('button');
    backButton.id = 'backToLoginButton';
    backButton.className = 'button yellow';
    backButton.innerText = 'Back';
    backButton.style.width = '100%';
    backButton.style.marginTop = 0.8 + 'rem';

    signupCard.append(
      cardTitle, 
      errorMessage,
      emailField, 
      passwordField, 
      passwordConfirmField, 
      createAccountButton, 
      backButton
    );

    this.currentCard = signupCard;

    document.body.append(signupCard);
  }

  showClozeCard(card) {
    // card = {
    //   fr: '{Tapez} moi sur votre clavier !', 
    //   en: '{Type} me on your keyboard!'
    // }

    const clozeCard = document.createElement('div');
    clozeCard.className = 'cloze centered';
    clozeCard.id = 'clozeCard';

    const primary = document.createElement('div');
    primary.id = 'primaryContainer';
    
    // Generate target phrase
    const targetPhrase = document.createElement('p');
    targetPhrase.className = 'targetPhrase';

    // Populate targetPhrase element
    for (let word of card.fr.split(' ')) {
      let span = document.createElement('span');

      if (this._isBracketed(word)) {
        span.className = 'clozeWord',
        word = word.replace(/[\{\}]/g, '');
        this.clozeWord = word;//.replace(/[\,\.]/g, '');
      } 

      span.innerText = word;

      targetPhrase.append(span);

      // Add space between words
      targetPhrase.insertAdjacentHTML('beforeend', ' ');
    }

    const nativePhrase = document.createElement('p');
    nativePhrase.className = 'nativePhrase';

    // Populate nativePhrase element
    for (let word of card.en.split(' ')) {
      if (this._isBracketed(word)) {
        // Remove brackets
        word = word.replace(/[\{\}]/g, '');

        // Target word
        let span = document.createElement('span');
        span.className = 'targetWord';
        span.innerText = word;

        nativePhrase.append(span)

        // Add space before and after targetWord
        span.insertAdjacentHTML('afterend', ' ');
      } else {
        nativePhrase.append(word + ' ');
      }
    }

    primary.append(targetPhrase, nativePhrase);

    // Add nativePhrase and buttons to bottom wrapper
    const secondary = document.createElement('div');
    secondary.id = 'secondaryContainer';

    // Generate buttons
    const buttons = document.createElement('div');
    buttons.className = 'buttons';

    // Record button
    const recordButton = document.createElement('button');
    recordButton.id = 'recordButton';
    recordButton.className = 'button yellow';
    recordButton.innerText = 'Record';

    // Input display
    const inputDisplay = document.createElement('div');
    inputDisplay.id = 'inputDisplay';

    // Speak button
    const speakButton = document.createElement('button');
    speakButton.id = 'speakButton';
    speakButton.className = 'button blue icon';

    const speakIcon = document.createElement('img');
    speakIcon.className = 'centered';
    speakIcon.src = './assets/svg/speaker.svg';
    speakIcon.style.width = 28 + 'px';
    speakButton.append(speakIcon);

    // Next button
    const nextButton = document.createElement('button');
    nextButton.id = 'nextButton';
    nextButton.className = 'button orange icon';

    const nextIcon = document.createElement('img');
    nextIcon.className = 'centered';
    nextIcon.src = './assets/svg/cross.svg';
    nextIcon.style.width = 20 + 'px';
    nextButton.append(nextIcon);

    secondary.append(recordButton, inputDisplay, speakButton, nextButton);

    clozeCard.append(primary, secondary);

    this.currentCard = clozeCard;

    document.body.append(clozeCard);
  }

  fillCloze(input, capitalise) {
    // Fills empty cloze with input word
    const clozeWord = document.querySelector('.clozeWord');
    if (capitalise) {
      input = input.charAt(0).toUpperCase() + word.slice(1);
    }
    clozeWord.classList.add('spoken');
    clozeWord.innerText = input;
  }

  hideCloze() {
    const clozeWord = document.querySelector('.clozeWord');
    clozeWord.classList.remove('spoken');

    // Wait for CSS transition to finish before replacing inner text
    setTimeout( () => {clozeWord.innerText = this.clozeWord;}, 200);
  }

  _isBracketed(string) {
    // Returns true if {string} is bracketed
    // const pattern = /(\{[^\]]*\})/; // g -- global flag
    const pattern = /[\{\}]/;
    return string.match(pattern);
  }

  _highlightWords(correctIdxs) {
    // Highlights correct words on cloze card
    const targetPhrase = document.querySelector('.targetPhrase');
    const targetSpans = targetPhrase.children;

    // Remove remaining highlights
    this._removeHighlights();

    for (let i of correctIdxs) {
      const span = targetSpans[i];
      span.classList.add('correct');
    }

  }

  _removeHighlights() {
    const targetPhrase = document.querySelector('.targetPhrase');
    const targetSpans = targetPhrase.children;

    targetPhrase.classList.remove('complete');
    targetPhrase.classList.remove('incomplete');

    for (let span of targetSpans) {
      span.classList.remove('correct');
    }
  }

  _confirm(state) {
    switch (state) {
      case 'correct':
        document.querySelector('.targetPhrase').classList.add('complete');
        break;
      case 'incorrect':
        document.querySelector('.targetPhrase').classList.add('incomplete');
        break;
      default:
        return;
    }
  }

  showFinishedCard() {
    const finishedCard = document.createElement('div');
    finishedCard.className = 'card centered dp1';
    finishedCard.style.textAlign = 'center';

    const message = document.createElement('p');
    message.innerText = 'All done for now!\nCheck back later for due cards.';
    message.className = 'centered';
    finishedCard.append(message)

    document.body.append(finishedCard);
  }

  _bindLoginButton(handler) {
    this.currentCard.addEventListener('click', (event) => {
      if (event.target.id !== 'loginButton') return;

      event.target.blur();

      const email = document.getElementById('emailField').value;
      const password = document.getElementById('passwordField').value;

      handler(email, password)
    });
  }

  _bindSignupButton(handler) {
    this.currentCard.addEventListener('click', (event) => {
      if (event.target.id !== 'signupButton') return;
      event.target.blur();
      handler();
    });
  }

  _bindForgotPasswordLink(handler) {
    this.currentCard.addEventListener('click', (event) => {
      if (event.target.id !== 'forgotPasswordLink') return;
      event.target.blur();
      handler();
    });
  }

  _bindSendPasswordResetButton(handler) {
    this.currentCard.addEventListener('click', (event) => {
      if (event.target.id !== 'sendButton') return;
      event.target.blur();

      const email = document.getElementById('emailField').value;
      handler(email);
    });
  }

  _bindBackToLoginButton(handler) {
    this.currentCard.addEventListener('click', (event) => {
      if (event.target.id !== 'backToLoginButton') return;
      event.target.blur();
      handler();
    });
  }

  _bindCreateAccountButton(handler) {
    this.currentCard.addEventListener('click', (event) => {
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
    this.nav.addEventListener('click', (event) => {
      if (event.target.id !== 'logoutButton') return;

      event.target.blur();

      handler();
    });
  }

  _bindSpeakButton(handler) {
    this.currentCard.addEventListener('click', (event) => {
      if (event.target.id !== 'speakButton' && 
          !event.target.matches('#speakButton img')) return;
      
      event.target.closest('.button').blur();

      const phrase = document.querySelector('.targetPhrase').innerText.trim();
      handler(phrase)
    });
  }

  _bindMicrophoneButton(handler) {
    this.currentCard.addEventListener('click', (event) => {
      if (event.target.id !== 'recordButton' &&
          !event.target.matches('#recordButton img')) return;

      event.target.closest('.button').blur();
      
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
    this.currentCard.querySelector('.error').style.visibility = 'visible';
    this.currentCard.querySelector('.error').innerText = message;

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
    document.querySelector('.error').style.visibility = 'visible';
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

  raiseForgotPasswordError(message) {
    const emailField = document.getElementById('emailField');

    // Change email field to error state
    emailField.parentElement.classList.add('field-failure');

    // Display error message
    document.querySelector('.error').style.visibility = 'visible';
    document.querySelector('.error').innerText = message;
  }

  _makeField(type, labelText, id) {
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
