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

var CLONED_MAP_POPUP = MAP_CARD_TEMPLATE.cloneNode(true);

function createObjectOfNodes(htmlCollection) {
  var object = {};
  htmlCollection.forEach(function (element) {
    var key = element.className.split('--').reverse()[0];
    object[key] = element;
  });
  return object;
}

function createMapPopup(array) {
  var fragment = document.createDocumentFragment();

  var mapPopupType = CLONED_MAP_POPUP.querySelector('.popup__type');
  var mapPopupFeatureList = CLONED_MAP_POPUP.querySelector('.popup__features');
  var mapPopupFeatures = mapPopupFeatureList.querySelectorAll('.popup__feature');
  var mapPopupPhotoList = CLONED_MAP_POPUP.querySelector('.popup__photos');
  var mapPopupPhoto = mapPopupPhotoList.querySelector('.popup__photo');
  CLONED_MAP_POPUP.querySelector('.popup__title').textContent = array[0].offer.title;
  CLONED_MAP_POPUP.querySelector('.popup__text--address').textContent = array[0].offer.address;
  CLONED_MAP_POPUP.querySelector('.popup__text--price').textContent = array[0].offer.price + '₽/ночь';
  mapPopupType.textContent = OFFER_TYPES_LIBS[array[0].offer.type];
  CLONED_MAP_POPUP.querySelector('.popup__text--capacity').textContent = array[0].offer.rooms + ' ' + getEndingWord(array[0].offer.rooms, VARIANTS_WORD_ROOMS) + ' для ' + array[0].offer.guests + ' ' + getEndingWord(array[0].offer.guests, VARIANTS_WORD_GUESTS) + '.';
  CLONED_MAP_POPUP.querySelector('.popup__text--time').textContent = 'Заезд после ' + array[0].offer.checkin + ', выезд до ' + array[0].offer.checkout;

  mapPopupFeatureList.innerHTML = '';
  var featuresFragment = document.createDocumentFragment();
  var objectOfNodes = createObjectOfNodes(mapPopupFeatures);

  array[0].offer.features.forEach(function (element) {
    var clonedNode = objectOfNodes[element].cloneNode(true);
    featuresFragment.appendChild(clonedNode);
  });

  mapPopupFeatureList.appendChild(featuresFragment);

  CLONED_MAP_POPUP.querySelector('.popup__description').textContent = array[0].offer.description;

  mapPopupPhotoList.innerHTML = '';
  var photosFragment = document.createDocumentFragment();


  array[0].offer.photos.forEach(function (element) {
    var clonedPhoto = mapPopupPhoto.cloneNode(true);
    clonedPhoto.src = element;
    photosFragment.appendChild(clonedPhoto);
  });

  mapPopupPhotoList.appendChild(photosFragment);

  CLONED_MAP_POPUP.querySelector('.popup__avatar').src = array[0].author.avatar;
  fragment.appendChild(CLONED_MAP_POPUP);
  MAP.insertBefore(fragment, MAP_FILTERS_CONTAINER);
}

MAP.classList.remove('map--faded');
drawPins(MAP_PIN_LIST, getMocks(SIMILAR_AD_COUNT));
createMapPopup(getMocks(SIMILAR_AD_COUNT));
