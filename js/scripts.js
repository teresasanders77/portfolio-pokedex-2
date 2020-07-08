//wrapped in IIFE to avoid acessing the global state
var pokemonRepository = (function () {
  var pokemonList = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  var $pokemonList = $('.pokemon-list');
  var $modalContainer = $('#modal-container');
  var $modal = $('.modal');

//adds pokemon to pokemonList as long as it's an object
function add(pokemon) {
    pokemonList.push(pokemon);
}

//function to pull all data
function getAll() {
  return pokemonList;
}

function addListItem(pokemon) {
  var $listItem = $('<li></li>');
//adds button for each list item
    $pokemonList.append($listItem);

    var $button = $('<button class="list-button">' + pokemon.name + '</button>');
    $listItem.append($button);

    $button.click(function() {
      showDetails(pokemon);
  });
}

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
    }).fail(function(e) {
      console.error(e);
    });
  }

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
      item.types = [];
        for (var i = 0; i < details.types.length; i++) {
           item.types.push(details.types[i].type.name);
    }
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

  $modal.append($closeButtonElement);
  $modal.append(nameElement);
  $modal.append(heightElement);
  $modal.append(weightElement);
  $modal.append(typesElement);
  $modal.append(abilitiesElement);
  $modal.append(imageElement);

  $modalContainer.addClass('is-visible');
}

function hideModal() {
  $modalContainer.removeClass('is-visible');
}

$(window).keydown(function(e) {
  if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
      hideModal();
    }
  });

$($modalContainer).click(function(e) {
  var target = e.target;
  if (target != $modal) {
    hideModal();
  }
 });


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

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
