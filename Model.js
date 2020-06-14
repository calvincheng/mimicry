export class Model {
  constructor() {
    this.db = {
      users: {
        1234: {
          name: "Calvin Cheng",
          email: "calvin.cc.cheng@gmail.com",
          progress: 0, // 4th word
          deck: 1234,
        },
      },

      cards: {
        0: {
          fr: "{Bonjour}, tout le monde !",
          en: "{Hello}, everybody!",
        },
        1: {
          fr: "Enchanté, {je} suis Sam.",
          en: "Nice to meet you, {I}'m Sam.",
        },
        2: {
          fr: "{Merci}, au revoir !",
          en: "{Thank you}, goodbye!",
        },
      },

      decks: {
        1234: {
          owner: 1234,
          cards: [
//             {
//               id: cardId,
//               repetitions: 0,
//               interval: 1, // in days
//               easiness: 0,
//             }
          ],
        }
      },
    }

    this.session = {
      user: null,
    }
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

  async getCardOffline(cardId) {
    const data = await this.db.cards[cardId];
    return data;
  }

  async getCard(cardId) {
    const data = await firebase.database().ref('/cards/' + cardId).once('value');
    return data.val();
  }
}
