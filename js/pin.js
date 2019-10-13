'use strict';

(function () {

  var MAP_PIN_TEMPLATE = document.querySelector('#pin').content.querySelector('.map__pin');

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
      pin.addEventListener('click', window.map.onMapPinClick);
      fragment.appendChild(pin);
    });

    return fragment;
  }

  window.pin.createPinsFragment = createPinsFragment;
})();
