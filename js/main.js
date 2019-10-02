'use strict';

var MAP = document.querySelector('.map');
var MAP_PIN_LIST = document.querySelector('.map__pins');
var MAP_MAIN_PIN = document.querySelector('.map__pin--main');
var MAP_MAIN_PIN_SIZE = {
  width: 65,
  height: 65,
  point: 65 / 2 + 22
};
var MAP_PIN_TEMPLATE = document.querySelector('#pin').content.querySelector('.map__pin');
var MAP_CARD_TEMPLATE = document.querySelector('#card').content.querySelector('.map__card');
var MAP_FILTERS_CONTAINER = MAP.querySelector('.map__filters-container');

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
  avatar: '.popup__avatar'
};

var KEYCODES = {
  esc: 27,
  enter: 13,
  space: 32
};

var FORMS_NODES = document.querySelectorAll('form > select, form > fieldset');
var AD_FORM = document.forms[1];

var ROOMS_NOT_GUEST_VALUE = 100;

function getRandomNum(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getRandomElement(array, isRemove) {
  var randomIndex = getRandomNum(0, array.length - 1);
  return (isRemove) ? array.splice(randomIndex, 1).toString() : array[randomIndex];
}

function createRandomArray(array) {
  var copyOfArray = array.slice();
  var randomArray = [];
  var counter = getRandomNum(1, copyOfArray.length);

  for (var i = 0; i < counter; i++) {
    randomArray.push(getRandomElement(copyOfArray, true));
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

function createPin(item) {
  var clonedPin = MAP_PIN_TEMPLATE.cloneNode(true);
  var clonedPinAuthor = clonedPin.querySelector('img');

  clonedPin.style.left = item.location.x + 'px';
  clonedPin.style.top = item.location.y + 'px';
  clonedPinAuthor.src = item.author.avatar;
  clonedPinAuthor.alt = item.offer.title;

  return clonedPin;
}

function drawPins(data) {
  var fragment = document.createDocumentFragment();

  data.forEach(function (item) {
    fragment.appendChild(createPin(item));
  });

  return fragment;
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
  clonedNodes.type.textContent = OFFER_TYPES_LIBS[item.offer.type];
  clonedNodes.capacity.textContent = item.offer.rooms + ' ' + getEndingWord(item.offer.rooms, VARIANTS_WORD_ROOMS) + ' для ' + item.offer.guests + ' ' + getEndingWord(item.offer.guests, VARIANTS_WORD_GUESTS) + '.';
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
  MAP.insertBefore(fragment, MAP_FILTERS_CONTAINER);
}

/*eslint-disable */
//suppress all warnings between comments
function createMapElements(count) {
  var mocks = getMocks(count);

  MAP_PIN_LIST.appendChild(drawPins(mocks));
  createMapPopup(mocks[0]);
}
/* jslint ignore:end */

function lockForms(htmlCollection) {
  htmlCollection.forEach(function (node) {
    node.disabled = 'disabled';
  });
}

function unlockForms(htmlCollection) {
  htmlCollection.forEach(function (node) {
    node.removeAttribute('disabled');
  });
}

function onMapPinMainKeydown(evt) {
  if (evt.keyCode === KEYCODES.enter || evt.keyCode === KEYCODES.space) {
    makePageActive();
  }
}

function onMapPinMainMousedown(evt) {
  evt.preventDefault();
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var isDrag = false;
  var limitDragArea = getLmitDragArea(MAP_PIN_LIST);

  function onMapPinMainMousemove(moveEvt) {
    moveEvt.preventDefault();
    isDrag = true;

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    var currentCoords = {
      x: MAP_MAIN_PIN.offsetLeft - shift.x,
      y: MAP_MAIN_PIN.offsetTop - shift.y
    };

    if (currentCoords.y >= limitDragArea.minY && currentCoords.y <= limitDragArea.maxY && currentCoords.x >= limitDragArea.minX && currentCoords.x <= limitDragArea.maxX) {

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      MAP_MAIN_PIN.style.top = currentCoords.y + 'px';
      MAP_MAIN_PIN.style.left = currentCoords.x + 'px';
      writeAddressField(MAP_MAIN_PIN_SIZE.point);
    }
  }

  function onMapPinMainMouseup(upEvt) {
    upEvt.preventDefault();

    if (isDrag) {
      var onMapPinMainClickPreventDefault = function (evtPrevDef) {
        evtPrevDef.preventDefault();
        MAP_MAIN_PIN.removeEventListener('click', onMapPinMainClickPreventDefault);
      };
    }

    MAP_MAIN_PIN.addEventListener('click', onMapPinMainClickPreventDefault);
    document.removeEventListener('mousemove', onMapPinMainMousemove);
    document.removeEventListener('mouseup', onMapPinMainMouseup);
  }

  document.addEventListener('mousemove', onMapPinMainMousemove);
  document.addEventListener('mouseup', onMapPinMainMouseup);
  makePageActive();
}

function makePageActive() {
  MAP.classList.remove('map--faded');
  AD_FORM.classList.remove('ad-form--disabled');
  unlockForms(FORMS_NODES);
  writeAddressField(MAP_MAIN_PIN_SIZE.point);
}

function writeAddressField(offsetFromCenter) {
  var top = (offsetFromCenter !== undefined) ? parseFloat(MAP_MAIN_PIN.style.top) + offsetFromCenter : parseFloat(MAP_MAIN_PIN.style.top);
  var left = parseFloat(MAP_MAIN_PIN.style.left);
  AD_FORM.address.value = (left + MAP_MAIN_PIN_SIZE.width / 2) + ', ' + (top + MAP_MAIN_PIN_SIZE.height / 2);
}

function getLmitDragArea(area) {
  var values = {
    minX: (area.offsetWidth - MAP_MAIN_PIN_SIZE.width / 2) - area.offsetWidth,
    maxX: area.offsetWidth - MAP_MAIN_PIN_SIZE.width / 2,
    minY: MAP_MIN_Y - (MAP_MAIN_PIN_SIZE.height / 2 + MAP_MAIN_PIN_SIZE.point),
    maxY: MAP_MAX_Y - (MAP_MAIN_PIN_SIZE.height / 2 + MAP_MAIN_PIN_SIZE.point)
  }
  return values;
}

function desableOption () {
  var selectedIndex = AD_FORM.capacity.selectedIndex;
  console.log(AD_FORM.capacity.options[selectedIndex].value)
  return AD_FORM.capacity.options[selectedIndex].value;
}

function onRoomsSelectChange(evt) {
  var form = document.forms[1];
  var capacitySelect = form.capacity;
  var roomsSelect = form.rooms;
  var index = roomsSelect.selectedIndex;
  var count = (+roomsSelect[index].value === ROOMS_NOT_GUEST_VALUE) ? roomsSelect.length - 1 : roomsSelect.length;

  if (count !== roomsSelect.length ) {
    for (var i = 0; i < count; i++) {
      capacitySelect[i].disabled = true;
      capacitySelect[i].selected = false;
    }
  } else {
    for (var i = 0; i < count; i++) {
      if(+capacitySelect[i].value <= +roomsSelect[index].value) {
        capacitySelect[i].disabled = false;
        continue;
      }
      capacitySelect[i].disabled = true;
      capacitySelect[i].selected = false;
    }
  }
}

lockForms(FORMS_NODES);
MAP_MAIN_PIN.addEventListener('mousedown', onMapPinMainMousedown);
MAP_MAIN_PIN.addEventListener('keydown', onMapPinMainKeydown);
AD_FORM.addEventListener('change', onRoomsSelectChange);
writeAddressField();
