$(document).ready(function() {
  $('#searchForm').on('submit', (event) => {
    let searchText = $('#searchText').val();
    getMovies(searchText);
    event.preventDefault();
  });

  $('.carousel').carousel({
    interval: 4000
  });
});

// INICIO FILTRO PELICULAS
function getMovies(searchText) {
  axios.get('https://www.omdbapi.com?s=' + searchText + '&apikey=b3cb4e7')
    .then(function(response) {
    // console.log(response);
      let movies = response.data.Search;
      // console.log('unicornio', movies);
      
      var ids = []; 
      for (var j = 0; j < movies.length ; j++) {
        ids.push(movies[j].imdbID);
      }
      // console.log('id', jojo);

      for (var k = 0; k < ids.length; k++) {
        var idMovie = [];
        var infoMovie = [];
        var awardedMovie = [];
        axios.get('https://www.omdbapi.com?i=' + ids[k] + '&apikey=b3cb4e7').then(function(response) {
          // console.log('response', response);
          infoMovie.push(response.data); 
          // console.log ('response data', infoMovie);
          // console.log('prueba', infoMovie[0].Awards);

          idMovie.push(response.data.imdbID);
          // console.log('ID', idMovie);

          // Recorremos las películas para seleccionar solo las premiadas o nominadas al Oscar.
          var awardedMovies = [];     
          for (var m = 0 ; m < infoMovie.length ; m++) {
            if ((infoMovie[m].Awards).indexOf('Oscar') >= 0) {
              awardedMovies.push(infoMovie[m]);
              // console.log('jojo',infoMovie); retorna todas las pelis consultadas
              // console.log('awardededed', awardedMovies);

              let output = '';
              $.each(awardedMovies, function(index, movie) {
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
            } else {
              console.log('none');
            }   
          }
        });      
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = 'moviepage.html';
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem('movieId');  
  axios.get('https://www.omdbapi.com?i=' + movieId + '&apikey=b3cb4e7')
    .then(function(response) {
      console.log(response);
      let movie = response.data;

      let output = `
        <div class="row">
          <div class="col-md-4">
          <ul>
            <li class="list-group-item"><img src="${movie.Poster}" class="thumbnail"></li>
          </ul>            
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
              <li class="list-group-item"><strong>Plot:</strong> ${movie.Plot}
              <hr>
              <a href="https://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
              <a href="paginicio.html" class="btn btn-default">Go Back To Search</a></li>
              
            </ul>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch(function(err) {
      console.log(err);
    });
}

// FIN FILTRO PELICULAS

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


// ejecuta acciones dependiendo si el user esta o no logeado
function watcher() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Existe usuario activo');
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
    /* location.reload();*/
      console.log('No hay usuario');
      location.href = 'loginpage.html'; // vuelve a la pagina de inicio si se deslogea
    // ...
    }
  });
}
watcher();

// deslogear
function getOut() {
  firebase.auth().signOut()
    .then(function() {
      console.log('Saliendo....');
    })
    .catch(function(error) {
      console.log(error);  
    });
  location.reload(); // actualiza para que al deslogear desaparesca Profile y Log out 
}

// INICIO RATING
$('.stars').on('click', '.star', function() {
  $(this).siblings('.pick').removeClass('pick');
  $(this).addClass('pick');
});
// FIN RATING  

// INICIO THUMBS
var up = $('.thumbsUp');
var down = $('.thumbsDown');

up.click(function() {
  $(this).toggleClass('orangeColor');
  down.removeClass('yellowColor');
});
down.click(function() {
  $(this).toggleClass('yellowColor');
  up.removeClass('orangeColor');
});
// FIN THUMBS

// INICIO AGREGAR COMENTARIOS

$('#btn').click(function() {
  var comentario = $('#comment').val();
  $('#comment').val('');
  var contenedor = $('#cont');
  contenedor.prepend('<div class="col-md-8 col-md-offset-4 colPost"><span class="nameUser">Vale </span>' + 
                      '<span class="said"> said...</span>' + '<span class="datePost">' + moment().format('MMM Do YY, H:mm:ss') + '</span>' + 
                      '<p class="textPost">' + comentario + 
                      '</p><i class="fa fa-trash trash"></i><i class="fa fa-heart heart"></i></div>');
  $('.heart').click(function() {
    $(this).toggleClass('redColor');
  });
  $('.trash').click(function() {
    $(this).parent().remove();
  });
}); 
// FIN AGREGAR COMENTARIOS
