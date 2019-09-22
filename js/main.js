'use strict';

var MAP = document.querySelector('.map');
var MAP_PIN_LIST = document.querySelector('.map__pins');
var MAP_PIN_TEMPLATE = document.querySelector('#pin').content.querySelector('.map__pin');

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
var OFFER_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

function getRandomNum(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomElement(array, remove) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return (remove) ? array.splice(randomIndex, 1).toString() : array[randomIndex];
}

function createRandomArray(array) {
  var arr = array.slice();
  var randomArray = [];
  var counter = getRandomNum(1, arr.length);

  for (var i = 0; i < counter; i++) {
    randomArray.push(getRandomElement(arr, true));
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

  for (var i = 0; i < mocks.length; i++) {
    fragment.appendChild(createPin(mocks[i]));
  }

  parentNode.appendChild(fragment);
}

MAP.classList.remove('map--faded');
drawPins(MAP_PIN_LIST, getMocks(SIMILAR_AD_COUNT));
