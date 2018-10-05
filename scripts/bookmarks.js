/* global store api $*/
'use strict';
// eslint-disable-next-line no-unused-vars
const bookmarks = (function(){
  $.fn.extend({
    serializeJson: function serializeJson(){
      if (!this.is('form')) throw new TypeError('Not a form');

      const formData = new FormData(this[0]);

      const jsonObj = {};
      formData.forEach((val, name) => jsonObj[name] = val);

      return JSON.stringify(jsonObj);
    }
  });
  
  //generates controls html -- either add / filter OR form
  
  function generateVerboseHtml(item){
    return `
      <li data-bookmark-id=${item.id} class="bookmark">
        <div class="verbose">
          <h3>${item.title}</h3>
          <div class="star-rating">
            <h4>star rating</h4>
            <h5>${item.rating}</h5>
          <div>
          <h4><a class="url" href="${item.url}">website</a></h4>
          <p>${item.desc}</p>
          <button class="js-delete-button">delete</button>
          <button>edit</button>
        </div>
      </li>
    `;
  }
  function generateCondensedHtml(item){
    return `
      <li data-bookmark-id=${item.id} class="bookmark">
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
    return `
    ${item ? '<li data-item-id class="bookmark">' : ''}
      <div class="edit-add-form">
        <form ${!item ? 'id="js-add-item-form" name="js-add-item-form"':''} class = ${!item ? 'js-new-item-form' : 'js-edit-item-form'} action="">
        ${!item ? 'Website name' : ''}<input class="js-name-data" type="text" ${!item ? 'name="title"':''} value="${item ? item.name : 'input'}"><br>
        ${!item ? 'Website url' : ''} <input class="js-url-data" type="text" ${!item ? 'name="url"':''} value="${item ? item.url : 'input'}"><br>
        ${!item ? 'Website description' : ''}  <input class="js-description-data" type="text" ${!item ? 'name="desc"':''} value="${item ? item.description : 'input'}"><br>
          <h5>Rating</h5>

      </div>
    ${item ? '</li>' : ''}
  
    `;

  }
  function generateControlsHtml(){
    if(store.addingNewItemToggle) {
      return generateFormHtml();
    }else{
      return `
        <button id="js-add-bookmark-button" class="add-new-item-button button">Add New Bookmark</button>
        <label for="stars">Filter by star rating: </label>
        <form class="js-filter-by-rating filter">
          ${generateFilterRadioButtons()}
        </form>
      `;
    }
  }
  function generateFilterRadioButtons(){
    let stars = '*';
    let radioButtonHtml = '';
    const filterRating = store.filterByRating;
    for(let i = 0; i < 5; i ++){
      radioButtonHtml += `<input class="filter-radio-btns" type="radio" name="stars" value="${i+1}"`;
      (filterRating === i+1) ? radioButtonHtml += ` checked>${stars}` : radioButtonHtml += `>${stars}`;
      stars += '*';
    }
    return radioButtonHtml;
  }
  function generatBookmarksItemsString(bookmarks) {
    const items = bookmarks.map((item) => {
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
    if (store.errorMessage){
      $('.js-error-message').html(store.errorMessage);
      store.errorMessage = null;
    }
    let items = store.items.filter(item => item.rating >= store.filterByRating);
    const bookmarksHtmlString = generatBookmarksItemsString(items);
    $('.js-controls').html(generateControlsHtml());
    $('.js-bookmarks').html(bookmarksHtmlString);
  }
  function handleAddItemButton(){
    $('.js-controls').on('click', '#js-add-bookmark-button', function(){
      store.addingNewItemToggle = true;
      render();
    });
  }
  function handleSubmitNewItem(){
    $('.js-controls').on('submit', '#js-add-item-form', event => {
      event.preventDefault();
      const newJsonItem = $(event.target).serializeJson();
      api.createItem(newJsonItem, 
        (newItem) => {
          store.addItem(newItem);
          store.addingNewItemToggle = false;
          render();
        },
        (err) => {
          const errMessage = JSON.parse(err.responseText).message; 
          store.errorMessage = errMessage;
          render();
        }
      );
    });
  }
  function handleCondensedModeToggle(){
    $('ul').on('click', '.bookmark', event => {
      const itemId = getIDFromElement(event.currentTarget);
      store.toggleCondensedMode(itemId);
      render();
    });
  }

  function handleDeleteItem(){
    $('ul').on('click', '.js-delete-button', event => {
      console.log(event.target);
      const item = event.target.closest('.bookmark');
      const id = getIDFromElement(item);
      console.log(id);
      api.deleteItem(id, 
        () => {
          store.deleteItem(id);
          render();
        });
    });
  }

  function handleFilterByRating(){
    $('.container').on('click', '.js-filter-by-rating', () =>{
      const filter = $('input[name=\'stars\']:checked').val();
      store.filterByRating = parseInt(filter, 10);
      render();
    });
  }
  function getIDFromElement(element){
    return $(element)
      .closest('.bookmark')
      .data('bookmark-id');
  }

  function bindEventListeners(){
    handleAddItemButton();
    handleSubmitNewItem();
    handleCondensedModeToggle();
    handleDeleteItem();
    handleFilterByRating();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());