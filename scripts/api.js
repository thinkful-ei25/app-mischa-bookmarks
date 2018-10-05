'use strict';
/* global $ */
//eslint-disable-next-line no-unused-vars
const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/mischa';

  const getItems = function(callback) {
    $.getJSON(BASE_URL + '/bookmarks', callback);
  };

  const createItem = function(item, onSuccess) {
    const newItem = JSON.stringify(item);
    console.log(newItem);
    $.ajax({
      url: BASE_URL + '/bookmarks',
      method: 'POST',
      contentType: 'application/json',
      data: newItem,
      success: onSuccess,
      // error: onError,
    });
  };

  // const updateItem = function(id, updateData, callback) {
  //   $.ajax({
  //     url: BASE_URL + '/items/' + id,
  //     method: 'PATCH',
  //     contentType: 'application/json',
  //     data: JSON.stringify(updateData),
  //     success: callback
  //   });
  // };

  // const deleteItem = function(id, callback) {
  //   $.ajax({
  //     url: BASE_URL + '/items/' + id,
  //     method: 'DELETE',
  //     success: callback
  //   });
  // };

  return {
    getItems,
    createItem,
    // updateItem,
    // deleteItem,
  };
}());