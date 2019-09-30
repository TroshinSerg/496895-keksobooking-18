'use strict';

var MAP = document.querySelector('.map');
var MAP_PIN_LIST = document.querySelector('.map__pins');
var MAP_PIN_TEMPLATE = document.querySelector('#pin').content.querySelector('.map__pin');
var MAP_CARD_TEMPLATE = document.querySelector('#card').content.querySelector('.map__card');
var MAP_FILTERS_CONTAINER = MAP.querySelector('.map__filters-container');
var SIMILAR_AD_COUNT = 8;
var MAP_WIDTH = MAP.offsetWidth;
var MAP_MIN_Y = 130;
var MAP_MAX_Y = 630;
var MAP_PIN_HALF_WIDTH = 25;
var MAP_PIN_HEIGHT = 70;
var MIN_COUNT_ROOM = 1;
var MAX_COUNT_ROOM = 10;
var MIN_PRICE = 1000;
var MAX_PRICE = 25000;
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_TYPES_LIBS = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var OFFER_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var VARIANTS_WORD_ROOMS = ['комнаты', 'комната', 'комнат'];
var VARIANTS_WORD_GUESTS = ['гостей', 'гостя', 'гостей'];

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
  avatar: '.popup__avatar'
};

function getRandomNum(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomElement(array, remove) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return (remove) ? array.splice(randomIndex, 1).toString() : array[randomIndex];
}

function createRandomArray(array) {
  var arrayCopy = array.slice();
  var randomArray = [];
  var counter = getRandomNum(1, arrayCopy.length);

  for (var i = 0; i < counter; i++) {
    randomArray.push(getRandomElement(arrayCopy, true));
  }

  return randomArray;
}

function getMocks(count) {
  var mocks = [];

  for (var i = 0; i < count; i++) {
    var serialNumber = String(i + 1).padStart(2, '0');
    var locationX = getRandomNum(MAP_PIN_HALF_WIDTH, MAP_WIDTH - MAP_PIN_HALF_WIDTH);
    var locationY = getRandomNum(MAP_MIN_Y + MAP_PIN_HEIGHT, MAP_MAX_Y);

    mocks.push({
      'author': {
        'avatar': 'img/avatars/user' + serialNumber + '.png'
      },

      'offer': {
        'title': 'Заголовок предложения №' + serialNumber,
        'address': locationX + ', ' + locationY,
        'price': getRandomNum(MIN_PRICE, MAX_PRICE),
        'type': getRandomElement(OFFER_TYPES),
        'rooms': getRandomNum(MIN_COUNT_ROOM, MAX_COUNT_ROOM),
        'guests': getRandomNum(0, MAX_COUNT_ROOM),
        'checkin': getRandomElement(OFFER_TIMES),
        'checkout': getRandomElement(OFFER_TIMES),
        'features': createRandomArray(OFFER_FEATURES),
        'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque dignissimos optio nesciunt sapiente tempore totam. Provident velit quas eligendi tempora molestias necessitatibus fugiat natus odit sunt, numquam unde? Saepe, assumenda!',
        'photos': createRandomArray(OFFER_PHOTOS)
      },

      'location': {
        'x': locationX,
        'y': locationY
      }
    });
  }

  return mocks;
}

function createPin(obj) {
  var clonedPin = MAP_PIN_TEMPLATE.cloneNode(true);
  var clonedPinAuthor = clonedPin.querySelector('img');

  clonedPin.style.left = obj.location.x + 'px';
  clonedPin.style.top = obj.location.y + 'px';
  clonedPinAuthor.src = obj.author.avatar;
  clonedPinAuthor.alt = obj.offer.title;

  return clonedPin;
}

function drawPins(parentNode, mocks) {
  var fragment = document.createDocumentFragment();

  mocks.forEach(function (element) {
    fragment.appendChild(createPin(element));
  });

  parentNode.appendChild(fragment);
}

function getEndingWord(num, endings) {
  if (num % 100 === 0 || num % 100 > 4 && num % 100 !== 1) {
    return endings[2];
  } else if (num % 100 === 1) {
    return endings[1];
  }
  return endings[0];
}

function createObjectOfNodes(htmlCollection) {
  var nodes = {};
  htmlCollection.forEach(function (element) {
    var key = element.className.split('--').pop();
    nodes[key] = element;
  });
  return nodes;
}

function createPhotosFragment(srcArray, clonableElement) {
  var fragment = document.createDocumentFragment();
  srcArray.forEach(function (element) {
    var clonedNode = clonableElement.cloneNode(true);
    clonedNode.src = element;
    fragment.appendChild(clonedNode);
  });
  return fragment;
}

function createFeaturesFragment(array, nodes) {
  var fragment = document.createDocumentFragment();
  var objectOfNodes = createObjectOfNodes(nodes);

  array.forEach(function (element) {
    var clonedNode = objectOfNodes[element].cloneNode(true);
    fragment.appendChild(clonedNode);
  });

  return fragment;
}

function clonePopupNodes(selectors, popup) {
  var nodes = {};
  var keys = Object.keys(selectors);

  keys.forEach(function (element) {
    nodes[element] = element.match(/es$/) !== null ? popup.querySelectorAll(selectors[element]) : popup.querySelector(selectors[element]);
  });

  return nodes;
}

function createMapPopup(array) {
  var clonedPopup = MAP_CARD_TEMPLATE.cloneNode(true);
  var fragment = document.createDocumentFragment();
  var clonedNodes = clonePopupNodes(SELECTORS_POPUP_NODES, clonedPopup);

  clonedNodes.title.textContent = array[0].offer.title;
  clonedNodes.address.textContent = array[0].offer.address;
  clonedNodes.price.textContent = array[0].offer.price + '₽/ночь';
  clonedNodes.type.textContent = OFFER_TYPES_LIBS[array[0].offer.type];
  clonedNodes.capacity.textContent = array[0].offer.rooms + ' ' + getEndingWord(array[0].offer.rooms, VARIANTS_WORD_ROOMS) + ' для ' + array[0].offer.guests + ' ' + getEndingWord(array[0].offer.guests, VARIANTS_WORD_GUESTS) + '.';
  clonedNodes.time.textContent = 'Заезд после ' + array[0].offer.checkin + ', выезд до ' + array[0].offer.checkout;
  clonedNodes.description.textContent = array[0].offer.description;
  clonedNodes.avatar.src = array[0].author.avatar;

  clonedNodes.featureList.innerHTML = '';
  var featuresFragment = createFeaturesFragment(array[0].offer.features, clonedNodes.features);
  clonedNodes.featureList.appendChild(featuresFragment);

  clonedNodes.photoList.innerHTML = '';
  var photosFragment = createPhotosFragment(array[0].offer.photos, clonedNodes.photo);
  clonedNodes.photoList.appendChild(photosFragment);

  fragment.appendChild(clonedPopup);
  MAP.insertBefore(fragment, MAP_FILTERS_CONTAINER);
}

MAP.classList.remove('map--faded');
drawPins(MAP_PIN_LIST, getMocks(SIMILAR_AD_COUNT));
createMapPopup(getMocks(SIMILAR_AD_COUNT));
