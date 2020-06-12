export class Model {
  constructor() {
    this.session = {
      user: null,
    }
  }

  _getBracketedWords(string) {
    // Helper function -- returns an array of bracketed words
    // e.g. "{Hello} world" returns [Hello]
    const pattern = /(\{[^\]]*\})/g; // g -- global flag
    const words = string.match(pattern);

    // Remove brackets
    words = words.map( word => word.slice(1, -1) );

    return words;
  }

  login(user) {
    // Gets user information for app
    firebase.database().ref('/users/' + user.uid).once('value')
      .then( (snapshot) => this.data = snapshot.val() );
  }

  signup(user) {
    const data = {
      email: user.email,
      creationTime: new Date().toJSON(),
      progress: 0,
      deck: user.uid,
    };
  firebase.database().ref('/users/' + user.uid).set(data);
  }

  async getCard(cardId) {
    const data = await firebase.database().ref('/cards/' + cardId).once('value');
    return data.val();
  }
}
