/* global cuid*/
'use strict';
// eslint-disable-next-line no-unused-vars
const store = (function(){
  // function getItem(){

  // }
  let addingNewItemToggle = false;

  const addItem = function(item){
    item.condensed = true;
    this.items.push(item);
    addingNewItemToggle = false;
  };

  function toggleCondensedMode(id){
    const item = this.items.find(item => item.id === id);
    item.condensed = !item.condensed;
  }

  function deleteItem(id){
    this.items = this.items.filter(item => item.id !== id);
  }
  
  let filterByRating = 1;

  let errorMessage = null;



  return{
    items : [],
    addingNewItemToggle,
    addItem,
    toggleCondensedMode,
    filterByRating,
    deleteItem,
    errorMessage
  };
}());