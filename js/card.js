'use strict';

(function () {

  var MAP_CARD_TEMPLATE = document.querySelector('#card').content.querySelector('.map__card');
  var MAP_FILTERS_CONTAINER = window.data.map.querySelector('.map__filters-container');
  var VARIANTS_WORD_ROOMS = ['комнаты', 'комната', 'комнат'];
  var VARIANTS_WORD_GUESTS = ['гостей', 'гостя', 'гостей'];
  var IS_MULTIPLE_REGEX = /es$/;

  var SELECTORS_POPUP_NODES = {
    type: '.popup__type',
    featureList: '.popup__features',
    features: '.popup__feature',
    photoList: '.popup__photos',
    photo: '.popup__photo',
    title: '.popup__title',
    address: '.popup__text--address',
    price: '.popup__text--price',
    capacity: '.popup__text--capacity',
    time: '.popup__text--time',
    description: '.popup__description',
    avatar: '.popup__avatar',
    close: '.popup__close'
  };

  function createObjectOfNodes(htmlCollection) {
    var nodes = {};
    htmlCollection.forEach(function (node) {
      var key = node.className.split('--').pop();
      nodes[key] = node;
    });
    return nodes;
  }

  function createPhotosFragment(sources, clonableElement) {
    var fragment = document.createDocumentFragment();
    sources.forEach(function (src) {
      var clonedNode = clonableElement.cloneNode(true);
      clonedNode.src = src;
      fragment.appendChild(clonedNode);
    });
    return fragment;
  }

  function createFeaturesFragment(features, nodes) {
    var fragment = document.createDocumentFragment();
    var objectOfNodes = createObjectOfNodes(nodes);

    features.forEach(function (feature) {
      var clonedNode = objectOfNodes[feature].cloneNode(true);
      fragment.appendChild(clonedNode);
    });

    return fragment;
  }

  function clonePopupNodes(selectors, popup) {
    var nodes = {};
    var keys = Object.keys(selectors);

    keys.forEach(function (key) {
      nodes[key] = IS_MULTIPLE_REGEX.test(key) ? popup.querySelectorAll(selectors[key]) : popup.querySelector(selectors[key]);
    });

    return nodes;
  }

  function createMapPopup(item) {
    var clonedPopup = MAP_CARD_TEMPLATE.cloneNode(true);
    var fragment = document.createDocumentFragment();
    var clonedNodes = clonePopupNodes(SELECTORS_POPUP_NODES, clonedPopup);

    clonedNodes.title.textContent = item.offer.title;
    clonedNodes.address.textContent = item.offer.address;
    clonedNodes.price.textContent = item.offer.price + '₽/ночь';
    clonedNodes.type.textContent = window.data.offerTypesLibs[item.offer.type];
    clonedNodes.capacity.textContent = item.offer.rooms + ' ' + window.utils.getEndingWord(item.offer.rooms, VARIANTS_WORD_ROOMS) + ' для ' + item.offer.guests + ' ' + window.utils.getEndingWord(item.offer.guests, VARIANTS_WORD_GUESTS) + '.';
    clonedNodes.time.textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
    clonedNodes.description.textContent = item.offer.description;
    clonedNodes.avatar.src = item.author.avatar;

    clonedNodes.featureList.innerHTML = '';
    var featuresFragment = createFeaturesFragment(item.offer.features, clonedNodes.features);
    clonedNodes.featureList.appendChild(featuresFragment);

    clonedNodes.photoList.innerHTML = '';
    var photosFragment = createPhotosFragment(item.offer.photos, clonedNodes.photo);
    clonedNodes.photoList.appendChild(photosFragment);

    fragment.appendChild(clonedPopup);
    window.data.map.insertBefore(fragment, MAP_FILTERS_CONTAINER);

    clonedNodes.close.addEventListener('click', window.map.onMapPopupCloseClick);
  }

  window.card.createMapPopup = createMapPopup;
})();
