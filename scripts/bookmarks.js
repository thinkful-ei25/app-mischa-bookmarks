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
  
  function starsFromRating(rating){
    let stars = '';
    for(let i = 0; i < rating; i++){
      stars += '*';
    }
    return stars;
  }
  function generateVerboseHtml(item){
    return `
      <li data-bookmark-id=${item.id} class="bookmark">
        <div class="verbose">
          <h3>${item.title}</h3>
            <span class="stars-rating">${starsFromRating(item.rating)}</span>
          <h4><a class="url" href="${item.url}">Visit Site</a></h4>
          <section class="desc-section">
            <h4 class="desc-title"> Description of this site: </h4> 
            <p class="desc">${item.desc}</p>
          </section>
          <button class="js-delete-button">delete</button>
        </div>
      </li>
    `;
  }
  function generateCondensedHtml(item){
    return `
      <li data-bookmark-id=${item.id} class="bookmark">
        <div class="condensed">
          <h3>${item.title}</h3>
          <span class="stars-rating">${starsFromRating(item.rating)}</span>
        </div>
      </li>
    `;
  }
  function generateNewItemFormHtml(){
    return `
      <div class="new-bookmark">
        <form id="js-add-item-form new-item-form" name="js-add-item-form" action="">
          <label for="name-data" class="input-title form-title"> Website title </label>
          <input class="name-data" type="text" name="title" placeholder="eg. Google"><br>
          <label for="url-data" class="input-url form-title"> Website Url </label>
          <input class="url-data" type="text" name="url" placeholder="eg. http://www.google.com"><br>
          <label for="desc-data" class="input-desc form-title"> Website Description </label>
          <input class="desc-data" type="text" name="desc" placeholder="eg. the best search engine out there" ><br>
          <label for="rating-data" class="input-rating form-title"> Rating </label>
          ${generateFilterRadioButtons()}
          <input type="submit" value="Submit">
        </form>
      </div>
      `;
  }

  function generateControlsHtml(){
    if(store.addingNewItemToggle) {
      return generateNewItemFormHtml();
    }else{
      return `
        <div class="default-control-bar">
          <button id="js-add-bookmark-button" class="add-new-item-button button">Add New Bookmark</button><br>
          <label for="stars">Filter by star rating: </label>
          <form class="js-filter-by-rating filter">
            ${generateFilterRadioButtons()}
          </form>
        </div>
      `;
    }
  }
  function generateFilterRadioButtons(){
    let stars = '*';
    let radioButtonHtml = '';
    const filterRating = store.filterByRating;
    for(let i = 0; i < 5; i ++){
      radioButtonHtml += `<input class="filter-radio-btns" type="radio" name="rating" value="${i+1}"`;
      (filterRating === i+1) ? radioButtonHtml += ` checked>${stars}` : radioButtonHtml += `>${stars}`;
      stars += '*';
    }
    return radioButtonHtml;
  }
  function generatBookmarksItemsString(bookmarks) {
    const items = bookmarks.map((item) => {
      if (item.condensed){
        return generateCondensedHtml(item);
      }else {
        return generateVerboseHtml(item);
      }
    });
    return items.join('');
  }
  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`;
    }

    return `
      <section class="error-content">
        <p>${message}</p>
      </section>
    `;
  }
  function render(){
    $('.js-error-message').empty();
    if (store.errorMessage) {
      console.log(store.errorMessage);
      const errorHtml = generateError(store.errorMessage);
      $('.js-error-message').html(errorHtml);
      console.log('test');
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
      console.log(newJsonItem);
      api.createItem(newJsonItem, 
        (newItem) => {
          store.addItem(newItem);
          store.addingNewItemToggle = false;
          render();
        },
        (err) => {
          store.errorMessage = err;
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
      const filter = $('input[name=\'rating\']:checked').val();
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