'use strict';

(function () {

  var MAP_PIN_LIST = document.querySelector('.map__pins');
  var MAP_MAIN_PIN = document.querySelector('.map__pin--main');
  var MAP_MAIN_PIN_SIZE = {
    size: 65,
    sizeWithPoint: 77,
    halfSize: 33,
    halfSizeWithPoint: 55
  };

  var KEYCODES = {
    esc: 27,
    enter: 13,
    space: 32
  };

  window.mapUtils = {
    mapMainPin: MAP_MAIN_PIN,
    onMapPopupCloseClick: function () {
      removePinActiveClass();
      removeMapPopup();
      document.removeEventListener('keydown', onMapPopupEscPress);
    },
    onMapPinClick: function (evt) {
      evt.preventDefault();
      var currentPin = evt.currentTarget;

      window.mapUtils.onMapPopupCloseClick();
      window.createMapPopup(window.data.mocks[currentPin.dataset.id]);

      currentPin.classList.add('map__pin--active');
      document.addEventListener('keydown', onMapPopupEscPress);
    }
  };

  setAddressField();

  function createMapElements(mocks) {
    MAP_PIN_LIST.appendChild(window.createPinsFragment(mocks));
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

      if (currentCoords.y >= limitDragArea.minY && currentCoords.y <= window.data.mapMaxY && currentCoords.x >= limitDragArea.minX && currentCoords.x <= limitDragArea.maxX) {

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

    if (window.data.map.classList.contains('map--faded')) {
      activatePage();
    }
  }

  function activatePage() {
    window.data.map.classList.remove('map--faded');
    window.formsUtils.adForm.classList.remove('ad-form--disabled');
    createMapElements(window.data.mocks);
    window.formsUtils.enableElements(window.formsUtils.formsNodes);
    window.formsUtils.onTypeSelectChange();
  }

  function setAddressField(offsetFromCenter) {
    var topCoord = parseFloat(MAP_MAIN_PIN.style.top);
    var top = (offsetFromCenter !== undefined) ? topCoord + offsetFromCenter : topCoord;
    var left = parseFloat(MAP_MAIN_PIN.style.left);
    window.formsUtils.adForm.address.value = (left + MAP_MAIN_PIN_SIZE.halfSize) + ', ' + (top + MAP_MAIN_PIN_SIZE.halfSize);
  }

  function getLimitDragArea(area) {
    var values = {
      minX: -MAP_MAIN_PIN_SIZE.halfSize,
      maxX: area.offsetWidth - MAP_MAIN_PIN_SIZE.halfSize,
      minY: window.data.mapMinY - MAP_MAIN_PIN_SIZE.sizeWithPoint + MAP_MAIN_PIN_SIZE.sizeWithPoint
    };
    return values;
  }


  function onMapPopupEscPress(evt) {
    if (evt.keyCode === KEYCODES.esc) {
      window.mapUtils.onMapPopupCloseClick();
    }
  }

  function removeMapPopup() {
    var mapPopup = window.data.map.querySelector('.popup');
    if (mapPopup) {
      window.data.map.removeChild(mapPopup);
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

  MAP_MAIN_PIN.addEventListener('mousedown', onMapPinMainMousedown);
  MAP_MAIN_PIN.addEventListener('keydown', onMapPinMainKeydown);

})();
