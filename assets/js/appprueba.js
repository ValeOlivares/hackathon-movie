$(document).ready(function(){ 
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function getMovies(searchText){
  axios.get('http://www.omdbapi.com?s='+searchText+'&apikey=b3cb4e7')
    .then(function(response){
    //console.log(response);
      let movies = response.data.Search;
      //console.log('unicornio', movies);
      
      var ids = []; 
      for(var j = 0; j < movies.length ; j++){
        ids.push(movies[j].imdbID);
      }
      //console.log('id', jojo);

      for(var k = 0; k< ids.length; k++){
        var idMovie =[];
        var infoMovie = [];
        var awardedMovie = [];
        axios.get('http://www.omdbapi.com?i='+ids[k]+'&apikey=b3cb4e7').then(function(response){
          //console.log('response', response);
          infoMovie.push(response.data); 
          //console.log ('response data', infoMovie);
          //console.log('prueba', infoMovie[0].Awards);

          idMovie.push(response.data.imdbID);
          //console.log('ID', idMovie);

        // Recorremos las películas para seleccionar solo las premiadas o nominadas al Oscar.
          var awardedMovies = [];     
          for (var m = 0 ; m < infoMovie.length ; m++){
            if ((infoMovie[m].Awards).indexOf("Oscar") >= 0){
              awardedMovies.push(infoMovie[m]);
              //console.log('jojo',infoMovie); retorna todas las pelis consultadas
              //console.log('awardededed', awardedMovies);

              let output = '';
              $.each(awardedMovies, function(index, movie){
                output += `
                  <div class="col-md-3 col-xs-3 col-lg-3 col-sm-3">
                    <div class="well text-center">
                      <img src="${movie.Poster}" class="img-responsive">
                      <h5>${movie.Title}</h5>
                      <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                    </div>
                  </div>
                `;
              });
              $('#movies').html(output);
          }else{
              console.log('none');
          }   
        }
      })      
    }
  })
  .catch(function(err) {
    console.log(err);
  });
}

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'moviepage.html';
  return false;
}

function getMovie(){
  let movieId = sessionStorage.getItem('movieId');  
  axios.get('http://www.omdbapi.com?i='+movieId+'&apikey=b3cb4e7')
    .then(function(response){
      console.log(response);
      let movie = response.data;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
              <li class="list-group-item"><strong>Awards:</strong> ${movie.Awards}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch(function(err){
      console.log(err);
    });
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAh8jLxKg9BALWSaYIiUBk-vXnRa_4gu4I",
  authDomain: "hackathon-movies.firebaseapp.com",
  databaseURL: "https://hackathon-movies.firebaseio.com",
  projectId: "hackathon-movies",
  storageBucket: "hackathon-movies.appspot.com",
  messagingSenderId: "215425576358"
};
  firebase.initializeApp(config);

//crear usuarios nuevos
function logIn(){
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
  }

function signUp(){
  var email1 = document.getElementById('email1').value;
  var password1 = document.getElementById('password1').value;
  firebase.auth().signInWithEmailAndPassword(email1, password1).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
  }

function observador(){
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    show();
  // User is signed in.
  var displayName = user.displayName;
  var email = user.email;
  var emailVerified = user.emailVerified;
  var photoURL = user.photoURL;
  var isAnonymous = user.isAnonymous;
  var uid = user.uid;
  var providerData = user.providerData;
  // ...
  } else {
  // User is signed out.
  // ...
  }
});
}
observador();

function show(){
  var show = document.getElementById('show');
  show.innerHTML = '<a href="#">Profile</a>';
}