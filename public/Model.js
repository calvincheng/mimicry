export class Model {
  constructor() {
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
  }

  async updateCard(cardId, deckId, quality) {
    // SuperMemo 2 (SM2) Algorithm
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
      newEase = +(card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))).toFixed(3);
    } else {
      // Incorrect response
      newRepetitions = 0
      newInterval = 1;
      newEase = card.ease;
    }

    if (newEase < 1.3) newEase = 1.3;

    const now = new Date();
    
    const HOURS_TO_MILLISECONDS = 1000 * 60 * 60;
    const newCard = {
      totalAttempts: card.totalAttempts + 1,
      repetitions: newRepetitions,
      interval: newInterval,
      ease: newEase,
      lastRevised: now.toJSON(),
      due: new Date(now.getTime() + (newInterval * HOURS_TO_MILLISECONDS)).toJSON() // TODO: CHANGE TO DAYS
    }

    // Update database 
    firebase.database().ref('/decks/'+deckId+'/cards/'+cardId).set(newCard);
  }

  async getDueCardIds(deckId) {
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

}
