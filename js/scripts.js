//wrapped in IIFE to avoid acessing the global state
var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $pokemonList = $('.pokemon-list');
  var $modalContainer = $('#modal-container');
  var $modal = $('.modal');

//adds pokemon to pokemonList
function add(pokemon) {
  pokemonList.push(pokemon);
}

//function to pull all data
function getAll() {
  return pokemonList;
}

//function to create a list 
function addListItem(pokemon) {
  var $listItem = $('<li></li>');
    $pokemonList.append($listItem);
//adds button for each list item
    var $button = $('<button class="list-button">' + pokemon.name + '</button>');
    $listItem.append($button);
//logs details of each pokemon when clicked 
    $button.click(function() {
      showDetails(pokemon);
  });
}

//function to load list from api
function loadList() {
    return $.ajax(apiUrl, {
      dataType: 'json',
      success: function(responseJSON) {
        responseJSON.results.forEach(function(item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      }
//if promise is rejected, the following is run 
    }).fail(function(e) {
      console.error(e);
    });
  }

//function to load details
function loadDetails(item) {
  var url = item.detailsUrl;
  return $.ajax(url, {
    dataType: 'json'
  })
    .then(function(responseJSON) {
      return responseJSON;
    })
    .then(function(details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
//loop for each type of pokemon
      item.types = [];
        for (var i = 0; i < details.types.length; i++) {
           item.types.push(details.types[i].type.name);
    }
//loop for the abilities of each pokemon
      item.abilities = [];
        for (var i = 0; i < details.abilities.length; i++) {
          item.abilities.push(details.abilities[i].ability.name);
    }
  })
    .catch(function(e) {
      console.error(e);
  });
} 

function showDetails(pokemon) {
  pokemonRepository
    .loadDetails(pokemon)
    .then(function() {
      return pokemon;
    })
    .then(function(pokemon) {
      showModal(pokemon);
    })
    .catch(function(e) {
      console.error(e);
    });
}

function showModal(pokemon) {
  $modalContainer.html('');

  var $modal = $('<div class="modal"></div>');
  $modalContainer.append($modal);

  var nameElement = $('<h1 class="pokemon-name">' + pokemon.name + '</h1>');
  $('.modal').append(nameElement);

  var heightElement = $('<p>height : ' + pokemon.height + 'm</p>');

  var weightElement = $('<p>weight : ' + pokemon.weight + 'kg</p>');

  var typesElement = $('<p>types: ' + pokemon.types + '</p>');

  var abilitiesElement = $('<p>abilitites : ' + pokemon.abilities + '</p>');

  var imageElement = $('<img class="modal-img"/>');
  imageElement.attr('src', pokemon.imageUrl);

  var $closeButtonElement = $('<button class="modal-close">Close</button>');
  $($closeButtonElement).click(function() {
    hideModal();
  });

//append modal content to page
  $modal.append($closeButtonElement);
  $modal.append(nameElement);
  $modal.append(heightElement);
  $modal.append(weightElement);
  $modal.append(typesElement);
  $modal.append(abilitiesElement);
  $modal.append(imageElement);

//add class to show modal
  $modalContainer.addClass('is-visible');
}

function hideModal() {
  $modalContainer.removeClass('is-visible');
}


//adds event listener when ESC is clicked 
$(window).keydown(function(e) {
  if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

//adds event listener if clicking outside of the modal
$($modalContainer).click(function(e) {
  var target = e.target;
  if (target != $modal) {
    hideModal();
  }
 });

//returns values that can be accessed to outside the IIFE
return {
  add: add,
  getAll: getAll,
  addListItem: addListItem,
  showModal: showModal,
  hideModal: hideModal,
  loadList: loadList,
  loadDetails: loadDetails
  };  

})();

//forEach function to list pokemon by name on buttons
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
