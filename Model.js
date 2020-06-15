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
          cards: {
//          cardId: {
//               repetitions: 0,
//               interval: 1, // in days
//               easiness: 0,
//          }
          },
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
    // Create user data
    const userData = {
      email: user.email,
      creationTime: new Date().toJSON(),
      progress: 0,
      deck: user.uid,
    };

    // Add user to database
    firebase.database().ref('/users/' + user.uid).set(userData);
  }

  addCardToUserDeck(cardId, deckId) {
    const cardData = {
      repetitions: 0,
      interval: 1,
      easiness: 0,
    };

    firebase.database().ref('/decks/' + deckId + '/cards/' + cardId).set(cardData);
  }

  addCardToUserDeckOffline(cardId, deckId) {
    // If card already in deck, ignore
    if (this.db.decks[deckId].cards[cardId]) return;

    const cardData = {
      repetitions: 0,
      interval: 1,
      ease: 0,
      lastRevised: null,
    };

    this.db.decks[deckId].cards[cardId] = cardData;
    console.log(this.db);
  }

  updateCardOffline(cardId, deckId, quality) {
    const card = this.db.decks[deckId].cards[cardId];

    if (quality < 0 || quality > 5) throw Error('Quality must be an integer between 0 and 5');

    let newInterval,    // in days
        newRepetitions, 
        newEase; 

    if (quality >= 3) {
      // Correct response
      if (card.repetitions === 0) {
        newInterval = 1;
      } else if (card.repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.ceil(card.interval * card.ease);
      }
      newRepetitions = card.repetitions + 1;
      newEase = card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      // Incorrect response
      newRepetitions = 0
      newInterval = 1;
      newEase = card.ease;
    }

    if (newEase < 1.3) newEase = 1.3;

    const now = new Date().toJSON();
    
    const newCard = {
      repetitions: newRepetitions,
      interval: newInterval,
      ease: newEase,
      lastRevised: now,
    }

    // Update database 
    this.db.decks[deckId].cards[cardId] = newCard;
  }

  async getCard(cardId) {
    const data = await firebase.database().ref('/cards/' + cardId).once('value');
    return data.val();
  }

  async getCardOffline(cardId) {
    const data = await this.db.cards[cardId];
    return data;
  }

}