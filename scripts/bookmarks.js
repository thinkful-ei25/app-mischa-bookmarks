/* global store api $*/
'use strict';
// eslint-disable-next-line no-unused-vars
const bookmarks = (function(){
  //generates controls html -- either add / filter OR form
  
  function generateVerboseHtml(item){
    return `
      <li class="bookmark">
        <div class="verbose">
          <h3>${item.title}</h3>
          <div class="star-rating">
            <h4>star rating</h4>
            <h5>${item.rating}</h5>
          <div>
          <h4><a class="url" href="${item.url}">website</a></h4>
          <p>${item.desc}</p>
          <button>add</button>
          <button>delete</button>
          <button>edit</button>
        </div>
      </li>
    `;
  }
  function generateCondensedHtml(item){
    return `
      <li class="bookmark">
        <div class="condensed">
          <h3>${item.title}</h3>
          <div class="js-star-rating">
              <h4>${item.rating}</h4>
          </div>
        </div>
      </li>
    `;
  }
  function generateFormHtml(item = null){
    console.log(item);
    return `
    ${item ? '<li class="bookmark">' : ''}
      <div class="edit-add-form">
        <form ${!item ? 'id="js-add-item-form" name="js-add-item-form"':''} class = ${!item ? 'js-new-item-form' : 'js-edit-item-form'} action="">
        ${!item ? 'Website name' : ''}<input class="js-name-data" type="text" ${!item ? 'name="name"':''} value="${item ? item.name : 'input'}"><br>
        ${!item ? 'Website url' : ''} <input class="js-url-data" type="text" ${!item ? 'name="url"':''} value="${item ? item.url : 'input'}"><br>
        ${!item ? 'Website description' : ''}  <input class="js-description-data" type="text" ${!item ? 'name="description"':''} value="${item ? item.description : 'input'}"><br>
          <h5>Rating</h5>
          <input type="radio" name="stars" value="1">*<br>
          <input type="radio" name="stars" value="2">**<br>
          <input type="radio" name="stars" value="3">***<br>
          <input type="radio" name="stars" value="4">****<br>
          <input type="radio" name="stars" value="5">*****<br>
          <input type="submit" value=${item ? 'save' : 'submit'}>
        </form>
      </div>
    ${item ? '</li>' : ''}
  
    `;

  }

  function generateControlsHtml(){
    if(store.addingNewItem) {
      return generateFormHtml();
    }else{
      return `
        <button id="js-add-bookmark-button" class="button">Add New Bookmark</button>
        <button id="select-rating-filter" class="button">Dropdown</button>
        <input type="radio" name="stars" value="1">*<br>
        <input type="radio" name="stars" value="2">**<br>
        <input type="radio" name="stars" value="3">***<br>
        <input type="radio" name="stars" value="4">****<br>
        <input type="radio" name="stars" value="5">*****<br>
      `;
    }
  }

  function generatBookmarksItemsString(bookmarks) {
    const items = bookmarks.map((item) => {
      // console.log(item);
      if (item.condensed){
        return generateCondensedHtml(item);
      }else if(item.editing){
        return generateFormHtml(item);
      }else {
        return generateVerboseHtml(item);
      }
    });
    return items.join('');
  }

  function render(){
    // const filter = getFilterByRating();
    const items = store.items.map((item) => {
      item.condensed = true;
      return item;
    });
    const bookmarksHtmlString = generatBookmarksItemsString(items);
    $('.js-controls').html(generateControlsHtml);
    $('.js-bookmarks').html(bookmarksHtmlString);
  }

  function handleAddItemButton(){
    $('.js-controls').on('click', '#js-add-bookmark-button', function(){
      store.addingNewItem = true;
      render();

    });
  }

  function handleSubmitNewItem(){
    $('.js-controls').on('submit', '#js-add-item-form', event => {
      event.preventDefault();
      const newItem = {
        title :  $('.js-name-data').val(),
        url :  $('.js-url-data').val(),
        desc : $('.js-description-data').val(),
        rating : $('input[name="stars"]:checked').val()
      };
      api.createItem(newItem, 
        (newItem) => {
          store.addItem(newItem);
          render();
        });
    });
  }
  function getFilterByRating(){

  }
  function bindEventListeners(){
    handleAddItemButton();
    handleSubmitNewItem();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());