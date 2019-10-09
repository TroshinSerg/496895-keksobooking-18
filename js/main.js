'use strict';

var MAP = document.querySelector('.map');
var MAP_PIN_LIST = document.querySelector('.map__pins');
var MAP_MAIN_PIN = document.querySelector('.map__pin--main');
var MAP_MAIN_PIN_SIZE = {
  size: 65,
  sizeWithPoint: 77,
  halfSize: 33,
  halfSizeWithPoint: 55
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
var SIMILAR_AD_COUNT = 8;
var OFFER_TYPES_LIBS = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};
var OFFER_TYPES_MIN_PRICES = {
  palace: 10000,
  flat: 1000,
  house: 5000,
  bungalo: 0
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
  avatar: '.popup__avatar',
  close: '.popup__close'
};

var KEYCODES = {
  esc: 27,
  enter: 13,
  space: 32
};

var FORMS_NODES = document.querySelectorAll('form > select, form > fieldset');
var AD_FORM = document.forms[1];
var ROOMS_NOT_GUEST_VALUE = 100;
var CAPACITY_NOT_GUEST_VALUE = 0;
var AD_FORM_SUBMIT = AD_FORM.querySelector('.ad-form__submit');
var INVALID_FIELD_BORDER_COLOR = 'red';
var SELECT_NAME_TIMEIN = 'timein';
var SELECT_NAME_TIMEOUT = 'timeout';

var AD_FORM_VALIDATE_VALUES = {
  titleMin: 30,
  priceMax: 1000000
};
var VALIDATION_ERROR_MESSAGES = {
  notGuest: 'Не для гостей',
  manyGuest: 'Гостей большей, чем комнат!'
};
var MOCKS = getMocks(SIMILAR_AD_COUNT);

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
        'address': [locationX, locationY].join(', '),
        'price': getRandomNum(MIN_PRICE, MAX_PRICE),
        'type': getRandomElement(Object.keys(OFFER_TYPES_LIBS)),
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

function createPinsFragment(data) {
  var fragment = document.createDocumentFragment();

  data.forEach(function (item, index) {
    var pin = createPin(item);
    pin.dataset.id = index;
    pin.addEventListener('click', onMapPinClick);
    fragment.appendChild(pin);
  });

  return fragment;
}

function getEndingWord(num, endings) {
  var remainder = num % 100;
  if (remainder === 0 || remainder > 4 && remainder !== 1) {
    return endings[2];
  } else if (remainder === 1) {
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

  clonedNodes.close.addEventListener('click', onMapPopupCloseClick);
}

function createMapElements(mocks) {
  MAP_PIN_LIST.appendChild(createPinsFragment(mocks));
}

function disableElements(htmlCollection) {
  htmlCollection.forEach(function (node) {
    node.disabled = 'disabled';
  });
}

function enableElements(htmlCollection) {
  htmlCollection.forEach(function (node) {
    node.removeAttribute('disabled');
  });
}

function onMapPinMainKeydown(evt) {
  if (evt.keyCode === KEYCODES.enter || evt.keyCode === KEYCODES.space) {
    activatePage();
  }
}

function onMapPinMainMousedown(evt) {
  evt.preventDefault();
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var isDrag = false;
  var limitDragArea = getLimitDragArea(MAP_PIN_LIST);

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

    if (currentCoords.y >= limitDragArea.minY && currentCoords.y <= MAP_MAX_Y && currentCoords.x >= limitDragArea.minX && currentCoords.x <= limitDragArea.maxX) {

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      MAP_MAIN_PIN.style.top = currentCoords.y + 'px';
      MAP_MAIN_PIN.style.left = currentCoords.x + 'px';
      setAddressField(MAP_MAIN_PIN_SIZE.sizeWithPoint);
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
  setAddressField(MAP_MAIN_PIN_SIZE.sizeWithPoint);

  if (MAP.classList.contains('map--faded')) {
    activatePage();
  }
}

function activatePage() {
  MAP.classList.remove('map--faded');
  AD_FORM.classList.remove('ad-form--disabled');
  createMapElements(MOCKS);
  enableElements(FORMS_NODES);
  onTypeSelectChange();
}

function setAddressField(offsetFromCenter) {
  var topCoord = parseFloat(MAP_MAIN_PIN.style.top);
  var top = (offsetFromCenter !== undefined) ? topCoord + offsetFromCenter : topCoord;
  var left = parseFloat(MAP_MAIN_PIN.style.left);
  AD_FORM.address.value = (left + MAP_MAIN_PIN_SIZE.halfSize) + ', ' + (top + MAP_MAIN_PIN_SIZE.halfSize);
}

function getLimitDragArea(area) {
  var values = {
    minX: -MAP_MAIN_PIN_SIZE.halfSize,
    maxX: area.offsetWidth - MAP_MAIN_PIN_SIZE.halfSize,
    minY: MAP_MIN_Y - MAP_MAIN_PIN_SIZE.sizeWithPoint + MAP_MAIN_PIN_SIZE.sizeWithPoint
  };
  return values;
}

function onMapPinClick(evt) {
  evt.preventDefault();
  var currentPin = evt.currentTarget;

  onMapPopupCloseClick();
  createMapPopup(MOCKS[currentPin.dataset.id]);

  currentPin.classList.add('map__pin--active');
  document.addEventListener('keydown', onMapPopupEscPress);
}

function onMapPopupCloseClick() {
  removePinActiveClass();
  removeMapPopup();
  document.removeEventListener('keydown', onMapPopupEscPress);
}

function onMapPopupEscPress(evt) {
  if (evt.keyCode === KEYCODES.esc) {
    onMapPopupCloseClick();
  }
}

function removeMapPopup() {
  var mapPopup = MAP.querySelector('.popup');
  if (mapPopup) {
    MAP.removeChild(mapPopup);
    document.removeEventListener('keydown', onMapPopupEscPress);
  }
  return false;
}

function removePinActiveClass() {
  var pin = MAP_PIN_LIST.querySelector('.map__pin--active');
  if (pin) {
    pin.classList.remove('map__pin--active');
  }
}

function addFieldBorderColor(field) {
  field.style.borderColor = INVALID_FIELD_BORDER_COLOR;
}

function onCapacityChange() {
  var selectedRoomsOption = AD_FORM.rooms[AD_FORM.rooms.selectedIndex];
  var selectedCapacityOption = AD_FORM.capacity[AD_FORM.capacity.selectedIndex];

  if (+selectedCapacityOption.value > +selectedRoomsOption.value) {
    addFieldBorderColor(AD_FORM.capacity);
    AD_FORM.capacity.setCustomValidity(VALIDATION_ERROR_MESSAGES.manyGuest);
    return false;
  }
  if (+selectedRoomsOption.value === ROOMS_NOT_GUEST_VALUE && +selectedCapacityOption.value !== CAPACITY_NOT_GUEST_VALUE) {
    addFieldBorderColor(AD_FORM.capacity);
    AD_FORM.capacity.setCustomValidity(VALIDATION_ERROR_MESSAGES.notGuest);
    return false;
  }
  AD_FORM.capacity.setCustomValidity('');
  AD_FORM.capacity.removeAttribute('style');
  return true;
}

function onTitleInput() {
  var titleFieldValue = AD_FORM.title.value.trim();
  if (!titleFieldValue || titleFieldValue.length < AD_FORM_VALIDATE_VALUES.titleMin) {
    addFieldBorderColor(AD_FORM.title);
    return false;
  }
  AD_FORM.title.removeAttribute('style');
  return true;
}

function onTypeSelectChange() {
  var selectedValue = AD_FORM.type[AD_FORM.type.selectedIndex].value;
  AD_FORM.price.min = OFFER_TYPES_MIN_PRICES[selectedValue];
  AD_FORM.price.placeholder = OFFER_TYPES_MIN_PRICES[selectedValue];
}

function onPriceInput() {
  var priceFieldValue = parseInt(AD_FORM.price.value, 10);
  var minValue = parseInt(AD_FORM.price.min, 10);
  if (!priceFieldValue || priceFieldValue < minValue || priceFieldValue > AD_FORM_VALIDATE_VALUES.priceMax) {
    addFieldBorderColor(AD_FORM.price);
    return false;
  }
  AD_FORM.price.removeAttribute('style');
  return true;
}

function onTimeSelectsChange(evt) {
  var currentSelectName = evt.currentTarget.name;
  var selectName = currentSelectName === SELECT_NAME_TIMEIN ? SELECT_NAME_TIMEOUT : SELECT_NAME_TIMEIN;
  AD_FORM[selectName][AD_FORM[currentSelectName].selectedIndex].selected = true;
}

function onAdFormSubmit(evt) {
  if (!onTitleInput() && !onPriceInput() && !onCapacityChange(evt)) {
    evt.preventDefault();
  }
}

disableElements(FORMS_NODES);
MAP_MAIN_PIN.addEventListener('mousedown', onMapPinMainMousedown);
MAP_MAIN_PIN.addEventListener('keydown', onMapPinMainKeydown);
AD_FORM.type.addEventListener('change', onTypeSelectChange);
AD_FORM.timein.addEventListener('change', onTimeSelectsChange);
AD_FORM.timeout.addEventListener('change', onTimeSelectsChange);
AD_FORM.title.addEventListener('input', onTitleInput);
AD_FORM.type.addEventListener('change', onPriceInput);
AD_FORM.price.addEventListener('input', onPriceInput);
AD_FORM.rooms.addEventListener('change', onCapacityChange);
AD_FORM.capacity.addEventListener('change', onCapacityChange);
AD_FORM_SUBMIT.addEventListener('click', onAdFormSubmit);
setAddressField();
