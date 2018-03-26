window.onload = function() {
  watcher();
  create();
};

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyAh8jLxKg9BALWSaYIiUBk-vXnRa_4gu4I',
  authDomain: 'hackathon-movies.firebaseapp.com',
  databaseURL: 'https://hackathon-movies.firebaseio.com',
  projectId: 'hackathon-movies',
  storageBucket: 'hackathon-movies.appspot.com',
  messagingSenderId: '215425576358'
};
firebase.initializeApp(config);

// Registrarse con email
function create() {  
  var email2 = document.getElementById('email2').value;
  var password2 = document.getElementById('password2').value;
  firebase.auth().createUserWithEmailAndPassword(email2, password2).catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  // ...
  });
}

// Ingreso de usuarios existentes 
function enter() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ...
  });
}

function loginWithGoogle() {
  $('')
  console.log('conectaaaando');
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log(user);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}

// realiza acciones si está o no logeado el usuario
function watcher() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Existe usuario activo');
      location.href = 'paginicio.html'; // envia a la pagina de inicio solo si se esta logeado
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // ...
      console.log(displayName);
    } else {
      console.log('No existe usuario activo');
      // User is signed out.
      // ...
    }
  });
} 
