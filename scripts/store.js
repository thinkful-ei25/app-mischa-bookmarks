/* global cuid*/
'use strict';
// eslint-disable-next-line no-unused-vars
const store = (function(){
  // function getItem(){

  // }
  const addItem = function(item){
    this.items.push(item);
  };
 
  const addingNewItemToggle = false;

  const filterByRating = 1;
  // const filterByRating = function(minRating){
  //   this.filter = minRating;
  // };






  return{
    items : [],
    addingNewItemToggle,
    addItem,
    filterByRating
  };
}());