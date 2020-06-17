export class Model {
  constructor() {

    this.db = {
      users: {
        hTfly2BvucRuD1AdGV6HNH73bnC3: {
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
        hTfly2BvucRuD1AdGV6HNH73bnC3: {
          owner: "hTfly2BvucRuD1AdGV6HNH73bnC3",
          cards: {
//          cardId: {
//               repetitions: 0,
//               interval: 1, // in days
//               easiness: 0,
//          }
//          0: {
//            repetitions: 0,
//            interval: 1,
//            easiness: 0,
//            lastRevised: null,
//            due: "2020-06-15T10:48:11.180Z",
//          },
          },
        }
      },
    }

    this.session = {
      user: null,
    }
  }

  async getUserData(uid) {
    // Gets user information for app
    const userData = await firebase.database().ref('/users/' + uid).once('value');
    return userData.val();
  }

  updateUserProgress(uid, progress) {
    firebase.database().ref('/users/' + uid + '/progress').set(progress);
  }

  signup(user) {
    // Add user to database
    const userData = {
      email: user.email,
      creationTime: new Date().toJSON(),
      progress: 0,
      deck: user.uid,
    };

    firebase.database().ref('/users/' + user.uid).set(userData);

    // Add user deck to database
    const deckData = {
      owner: user.uid,
    }
    firebase.database().ref('/decks/' + user.uid).set(deckData);
  }

  addCardToUserDeck(cardId, deckId) {
    const cardData = {
      totalAttempts: 0,
      repetitions: 0,
      interval: 1,
      ease: 0,
      lastRevised: null,
      due: new Date().toJSON(), // now
    };
    firebase.database().ref('/decks/' + deckId + '/cards/' + cardId).set(cardData);
    // this.db.decks[deckId].cards[cardId] = cardData;
  }

  async updateCard(cardId, deckId, quality) {
    // SuperMemo 2 (SM2) Algorithm
    // const card = this.db.decks[deckId].cards[cardId];
    const cardData = await firebase.database().ref('/decks/'+deckId+'/cards/'+cardId).once('value');
    const card = cardData.val();

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
      newEase = (card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))).toFixed(3);
    } else {
      // Incorrect response
      newRepetitions = 0
      newInterval = 1;
      newEase = card.ease;
    }

    if (newEase < 1.3) newEase = 1.3;

    const now = new Date();
    
    const newCard = {
      totalAttempts: card.totalAttempts + 1,
      repetitions: newRepetitions,
      interval: newInterval,
      ease: newEase,
      lastRevised: now.toJSON(),
      due: new Date(now.getTime() + (newInterval * 60 * 1000)).toJSON() // TODO: CHANGE TO DAYS
    }

    // Update database 
    // this.db.decks[deckId].cards[cardId] = newCard;
    firebase.database().ref('/decks/'+deckId+'/cards/'+cardId).set(newCard);
  }

//  async getDueCardIdsOffline(deckId) {
  async getDueCardIds(deckId) {
//    const deck = this.db.decks[deckId].cards;
    const deckData = await firebase.database().ref('/decks/'+deckId+'/cards').once('value');
    const deck = deckData.val();
    const now = new Date();

    let dueCardIds = [];
    for (let cardId in deck) {
      if (new Date(deck[cardId].due) <= now) dueCardIds.unshift(cardId);
    }

    return dueCardIds;
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
