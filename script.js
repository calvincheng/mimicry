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

let db = firebase.database();
let auth = firebase.auth();
let provider = new firebase.auth.GoogleAuthProvider();

// ----------------------------

import { View } from './View.js';
import { Model } from './Model.js';
import { Controller } from './Controller.js';

const app = new Controller(new Model, new View);


