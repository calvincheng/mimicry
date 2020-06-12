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

// import { config } from './config.js';
// let firebaseConfig = config.firebase;
const firebaseConfig = {
        apiKey: "AIzaSyCFiWO2Shkk2jEQLp0ako4j7lgQ_DoOjnI",
        authDomain: "mimicry-app.firebaseapp.com",
        databaseURL: "https://mimicry-app.firebaseio.com",
        projectId: "mimicry-app",
        storageBucket: "mimicry-app.appspot.com",
        messagingSenderId: "261960891324",
        appId: "1:261960891324:web:35f3ecf09c327b9bbc89b9"
};

firebase.initializeApp(firebaseConfig);

// ----------------------------

import { View } from './View.js';
import { Model } from './Model.js';
import { Controller } from './Controller.js';

const app = new Controller(new Model, new View);


