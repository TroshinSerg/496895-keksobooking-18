'use strict';

(function () {
  var MAP = document.querySelector('.map');
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
  var OFFER_TIMES = ['12:00', '13:00', '14:00'];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var OFFER_TYPES_LIBS = {
    palace: 'Дворец',
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  var DATA = {
    map: MAP,
    mapMinY: MAP_MIN_Y,
    mapMaxY: MAP_MAX_Y,
    offerTypesLibs: OFFER_TYPES_LIBS,
    mocks: getMocks(SIMILAR_AD_COUNT)
  };

  function getMocks(count) {
    var mocks = [];

    for (var i = 0; i < count; i++) {
      var serialNumber = String(i + 1).padStart(2, '0');
      var locationX = window.utils.getRandomNum(MAP_PIN_HALF_WIDTH, MAP_WIDTH - MAP_PIN_HALF_WIDTH);
      var locationY = window.utils.getRandomNum(MAP_MIN_Y + MAP_PIN_HEIGHT, MAP_MAX_Y);

      mocks.push({
        'author': {
          'avatar': 'img/avatars/user' + serialNumber + '.png'
        },

        'offer': {
          'title': 'Заголовок предложения №' + serialNumber,
          'address': [locationX, locationY].join(', '),
          'price': window.utils.getRandomNum(MIN_PRICE, MAX_PRICE),
          'type': window.utils.getRandomElement(Object.keys(OFFER_TYPES_LIBS)),
          'rooms': window.utils.getRandomNum(MIN_COUNT_ROOM, MAX_COUNT_ROOM),
          'guests': window.utils.getRandomNum(0, MAX_COUNT_ROOM),
          'checkin': window.utils.getRandomElement(OFFER_TIMES),
          'checkout': window.utils.getRandomElement(OFFER_TIMES),
          'features': window.utils.createRandomArray(OFFER_FEATURES),
          'description': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque dignissimos optio nesciunt sapiente tempore totam. Provident velit quas eligendi tempora molestias necessitatibus fugiat natus odit sunt, numquam unde? Saepe, assumenda!',
          'photos': window.utils.createRandomArray(OFFER_PHOTOS)
        },

        'location': {
          'x': locationX,
          'y': locationY
        }
      });
    }

    return mocks;
  }

  window.data = DATA;
})();
