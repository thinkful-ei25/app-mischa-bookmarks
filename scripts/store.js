/* global */
'use strict';
// eslint-disable-next-line no-unused-vars
const store = (function(){

  const toggleAdding = function() {
    this.addingAnItem = !this.addingAnItem;
  };

  const filterByRating = function(minRating){
    this.filter = minRating;
  };






  return{
    items: [],
    toggleAdding,
    filterByRating
  };
}());