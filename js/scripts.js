//wrapped in IIFE to avoid acessing the global state
var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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
  var pokemonList = $('.pokemon-list');
  var $listItem = $('<li></li>');
  //adds button for each list item
  var $button = $('<button type="button" class="btn btn-light btn-lg btn-block" data-target="#exampleModal" data-toggle="modal">' + pokemon.name + "</button>");
  pokemonList.append($listItem);
  $listItem.append($button);
  //logs details of each pokemon when clicked
  $button.on('click', function(event) {
    showDetails(pokemon);
  });
}

function showDetails(pokemon) {
  pokemonRepository
  .loadDetails(pokemon).then(function() {
    console.log(pokemon);
    showModal(pokemon);
  });
}

//function to load list from api
function loadList() {
  return $.ajax(apiUrl)
  .then(function (json) {
    json.results.forEach(function(item) {
      var pokemon = {
        name: item.name,
        detailsUrl: item.url
      };
      add(pokemon);
    });
  })
  //if promise is rejected, the following is run
  .catch(function(e) {
    console.error(e);
  });
}

//function to load details
function loadDetails(item) {
  var url = item.detailsUrl;
  return $.ajax(url)
  .then(function (details) {
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

function showModal(pokemon) {
  var modalBody = $('.modal-body');
  var modalTitle = $('.modal-title');
  modalBody.empty();
  modalTitle.empty();

  var nameElement = $('<h1>' + pokemon.name + '</h1>')
  modalTitle.append(nameElement);

  var heightElement = $('<p>' + 'Height: ' + pokemon.height + '</p>');
  modalBody.append(heightElement);

  var weightElement = $('<p>' + 'Weight : ' + pokemon.weight + '</p>');
  modalBody.append(weightElement);

  var typesElement = $('<p>' + 'Types: ' + pokemon.types + '</p>');
  modalBody.append(typesElement);

  var abilitiesElement = $('<p>' + 'Abilities: ' + pokemon.abilities + '</p>');
  modalBody.append(abilitiesElement);

  var imageElement = $('<img class="modal-img">');
  imageElement.attr('src', pokemon.imageUrl);
  modalBody.append(imageElement);
}

//returns values that can be accessed to outside the IIFE
return {
  add: add,
  getAll: getAll,
  addListItem: addListItem,
  showModal: showModal,
  loadList: loadList,
  showDetails: showDetails,
  loadDetails: loadDetails
  };

})();

//forEach function to list pokemon by name on buttons
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
