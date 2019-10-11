'use strict';

(function () {
  var FORMS_NODES = document.querySelectorAll('form > select, form > fieldset');
  var OFFER_TYPES_MIN_PRICES = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };

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

  window.formsUtils = {
    adForm: AD_FORM,
    formsNodes: FORMS_NODES,
    enableElements: function (htmlCollection) {
      htmlCollection.forEach(function (node) {
        node.removeAttribute('disabled');
      });
    },
    onTypeSelectChange: function () {
      var selectedValue = AD_FORM.type[AD_FORM.type.selectedIndex].value;
      AD_FORM.price.min = OFFER_TYPES_MIN_PRICES[selectedValue];
      AD_FORM.price.placeholder = OFFER_TYPES_MIN_PRICES[selectedValue];
    }
  };

  function disableElements(htmlCollection) {
    htmlCollection.forEach(function (node) {
      node.disabled = 'disabled';
    });
  }

  function addFieldBorderColor(field) {
    field.style.borderColor = INVALID_FIELD_BORDER_COLOR;
  }

  function removeFieldBorderColor(field) {
    field.removeAttribute('style');
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
    removeFieldBorderColor(AD_FORM.capacity);
    AD_FORM.capacity.removeAttribute('style');
    return true;
  }

  function onTitleInput() {
    var titleFieldValue = AD_FORM.title.value.trim();
    if (!titleFieldValue || titleFieldValue.length < AD_FORM_VALIDATE_VALUES.titleMin) {
      addFieldBorderColor(AD_FORM.title);
      return false;
    }
    removeFieldBorderColor(AD_FORM.title);
    return true;
  }

  function onPriceInput() {
    var priceFieldValue = parseInt(AD_FORM.price.value, 10);
    var minValue = parseInt(AD_FORM.price.min, 10);
    if (!priceFieldValue || priceFieldValue < minValue || priceFieldValue > AD_FORM_VALIDATE_VALUES.priceMax) {
      addFieldBorderColor(AD_FORM.price);
      return false;
    }
    removeFieldBorderColor(AD_FORM.price);
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
  AD_FORM.type.addEventListener('change', window.formsUtils.onTypeSelectChange);
  AD_FORM.timein.addEventListener('change', onTimeSelectsChange);
  AD_FORM.timeout.addEventListener('change', onTimeSelectsChange);
  AD_FORM.title.addEventListener('input', onTitleInput);
  AD_FORM.type.addEventListener('change', onPriceInput);
  AD_FORM.price.addEventListener('input', onPriceInput);
  AD_FORM.rooms.addEventListener('change', onCapacityChange);
  AD_FORM.capacity.addEventListener('change', onCapacityChange);
  AD_FORM_SUBMIT.addEventListener('click', onAdFormSubmit);

})();
