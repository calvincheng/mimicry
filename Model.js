export class Model {
  constructor() {
    this.db = firebase.database();
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
    this.db.ref('/users' + user.uid).once('value')
      .then( (snapshot) => this.data = snapshot.val() );
  }

  signup(user) {
    const data = {
      email: user.email,
      creationTime: new Date().toJSON(),
      progress: 0,
      deck: user.uid,
    };
    this.db.ref('users/' + user.uid).set(data);
  }

  async getCard() {
    const data = await this.db.ref('cards/1').once('value')
    return data.val();
  }
}
