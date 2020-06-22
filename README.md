<p align="center">
	<img src="./media/logo.png" alt="logo" width="33%"/>
</p>

<h3 align="center">Language learning with voice controlled cloze cards (WIP)</h3>

<h4 align="center">
<a href="#overview">Overview</a> • <a href="#demo">Demo</a> • <a href="#built-with">Built With</a> • <a href="#todos">Todos</a> • <a href="#bugs">Bugs</a> • <a href="#goals">Goals</a> 
</h4>



<p align="center">
  <img src="./media/demo.gif" width="90%" />
</p>



<h2 id="overview">Overview</h2>

A language-learning web application based on voice-controlled cloze cards. It aims to help users learn new words and develop confidence and muscle memory in speaking their target languages.

_Work in progress_




<h2 id="demo">Demo</h2>

[__Live Demo__](https://calvincheng.github.io/Mimicry) (Note: Only supported on Google Chrome)



<h2 id="built-with">Built With</h2>

* [Firebase Authentication](https://firebase.google.com/docs/auth)
* [Firebase Realtime Database](https://firebase.google.com/docs/database)
* [WebSpeech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
* [Material Design](https://material.io/design)



<h2 id="todos">Todos</h2>

* Add (!) logo in error messages for accessibility for the colour-blind
* Email verification
* Add more cards
* Add loading screen
* More intuitive user recording
* ~~Add cloze deletion~~
* User profile menu
* List of seen cards
* Next/previous card



<h2 id="bugs">Bugs</h2>

* ~~Multi-word cloze (e.g. {s'il vous plaît}) not detected properly~~ (Limiting scope to single words)
* Punctuation following bracketed words are highlighted (e.g. {please}.  highlights the "." as well)



<h2 id="goals">Goals</h2>

* Replace WebSpeech API with Google Cloud Speech-To-Text API
* Other languages


