'use strict';
/* global $ */
//eslint-disable-next-line no-unused-vars
const api = (function(){
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/mischa';

  const getItems = function(callback) {
    $.getJSON(BASE_URL + '/bookmarks', callback);
  };

  const createItem = function(item, onSuccess) {
    $.ajax({
      url: BASE_URL + '/bookmarks',
      method: 'POST',
      contentType: 'application/json',
      data: item,
      success: onSuccess,
      // error: onError,
    });
  };

  const deleteItem = function(id, callback) {
    $.ajax({
      url: BASE_URL + '/bookmarks/' + id,
      method: 'DELETE',
      success: callback
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

 

  return {
    getItems,
    createItem,
    // updateItem,
    deleteItem,
  };
}());