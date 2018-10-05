/* global bookmarks, store $ api*/
'use strict';
$(document).ready(function() {
  // shoppingList.bindEventListeners();
  bookmarks.bindEventListeners();
  bookmarks.render();

  api.getItems((items) => {
    items.forEach((item) => store.addItem(item));
    bookmarks.render();
  });
});

