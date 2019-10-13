'use strict';

(function () {
  var UTILS = {
    getRandomNum: function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    getRandomElement: function (array, isRemove) {
      var randomIndex = this.getRandomNum(0, array.length - 1);
      return (isRemove) ? array.splice(randomIndex, 1).toString() : array[randomIndex];
    },
    createRandomArray: function (array) {
      var copyOfArray = array.slice();
      var randomArray = [];
      var counter = this.getRandomNum(1, copyOfArray.length);

      for (var i = 0; i < counter; i++) {
        randomArray.push(this.getRandomElement(copyOfArray, true));
      }
      return randomArray;
    },
    getEndingWord: function (num, endings) {
      var remainder = num % 100;
      if (remainder === 0 || remainder > 4 && remainder !== 1) {
        return endings[2];
      } else if (remainder === 1) {
        return endings[1];
      }
      return endings[0];
    }
  };

  window.utils = UTILS;
})();
