'use strict';
var EXERCISE_URL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';
var RECIPE;
;
var updateTotalCosts = function () {
    var allPriceFields = document.querySelectorAll('.recipe-main__value');
    var shippingCost = RECIPE['shipping-cost'];
    var total = 0;
    allPriceFields.forEach(function (priceField) { return total += Number(priceField.innerHTML.slice(0, priceField.innerHTML.length - 1).replace(',', '.')); });
    document.getElementById('subtotal').innerHTML = total.toFixed(2).replace('.', ',') + RECIPE.currency;
    document.getElementById('total').innerHTML = (total + shippingCost).toFixed(2).replace('.', ',') + RECIPE.currency;
    document.getElementById('totalButton').innerHTML = (total + shippingCost).toFixed(2).replace('.', ',') + RECIPE.currency;
};
var updateTotalQuantities = function () {
    var allQuantityFields = document.querySelectorAll('.recipe-main__quantityField');
    var total = 0;
    allQuantityFields.forEach(function (quantityField) { return total += Number(quantityField.value); });
    document.getElementById('quantity').innerHTML = total.toString();
};
var determineCosts = function (ingredientId, quantity) {
    for (var _i = 0, _a = RECIPE.ingredients; _i < _a.length; _i++) {
        var _ingredient = _a[_i];
        var costPerUnity = void 0;
        if (_ingredient.id === ingredientId) {
            costPerUnity = _ingredient.price;
            return (costPerUnity * quantity).toFixed(2).replace('.', ',') + RECIPE.currency;
        }
    }
};
var buyIt = function () {
    var total = document.getElementById('total').innerHTML;
    document.querySelector('.main__wrapper').remove();
    var pleaseWait = document.createElement('img');
    pleaseWait.setAttribute('src', 'images/loading.gif');
    pleaseWait.classList.add('pleaseWait');
    var pleaseWaitText = document.createElement('p');
    pleaseWaitText.innerHTML = 'Procesando tu compra...';
    pleaseWaitText.classList.add('pleaseWaitText');
    var thankYouText = document.createElement('p');
    thankYouText.classList.add('thankU', 'hidden');
    thankYouText.innerHTML = "El total de " + total + " ha sido debitado de tu tarjeta.\n  Gracias por tu compra.";
    document.querySelector('.header').append(thankYouText, pleaseWait, pleaseWaitText);
    setTimeout(function () {
        pleaseWait.classList.add('hidden');
        pleaseWaitText.classList.add('hidden');
        thankYouText.classList.remove('hidden');
    }, 4000);
};
var handleToggleAll = function (action) {
    var CHECKBOXES = document.querySelectorAll('.recipe-main__checkbox');
    var isNotChecked;
    action === 'deselect' ? isNotChecked = true : isNotChecked = false;
    CHECKBOXES.forEach(function (checkbox) { return checkbox.checked === isNotChecked && checkbox.click(); });
};
var handleCheckboxClick = function (clickEvent) {
    var thisIngredient = clickEvent.currentTarget.parentElement;
    if (clickEvent.currentTarget.checked) {
        thisIngredient.querySelector('.recipe-main__quantityField').value = '1';
        thisIngredient.querySelector('.recipe-main__value').innerHTML = determineCosts(thisIngredient.id, 1);
    }
    else {
        thisIngredient.querySelector('.recipe-main__quantityField').value = '0';
        thisIngredient.querySelector('.recipe-main__value').innerHTML = determineCosts(thisIngredient.id, 0);
    }
    updateTotalQuantities();
    updateTotalCosts();
};
var handleQuantityInputChange = function (changeEvent) {
    var thisIngredient = changeEvent.currentTarget.parentElement;
    var thisCheckBox = thisIngredient.querySelector('.recipe-main__checkbox');
    var quantity = parseFloat(changeEvent.currentTarget.value);
    thisIngredient.querySelector('.recipe-main__value').innerHTML = determineCosts(thisIngredient.id, quantity);
    if (thisCheckBox.checked === false) {
        thisCheckBox.checked = true;
    }
    else if (Number(quantity) === 0) {
        thisCheckBox.checked = false;
    }
    updateTotalQuantities();
    updateTotalCosts();
};
var addEventListeners = function () {
    var CHECKBOXES = document.querySelectorAll('.recipe-main__checkbox');
    var QUANTITY_INPUTS = document.querySelectorAll('.recipe-main__quantityField');
    var SELECT_ALL = document.getElementById('selectAll');
    var DESELECT_ALL = document.getElementById('deselectAll');
    var BUTTON_BUY = document.getElementById('buyIt');
    CHECKBOXES.forEach(function (checkbox) {
        checkbox.addEventListener('click', handleCheckboxClick);
    });
    QUANTITY_INPUTS.forEach(function (input) {
        input.addEventListener('input', handleQuantityInputChange);
    });
    SELECT_ALL.addEventListener('click', function () { return handleToggleAll('select'); });
    DESELECT_ALL.addEventListener('click', function () { return handleToggleAll('deselect'); });
    BUTTON_BUY.addEventListener('click', buyIt);
};
var catchIngredients = function () {
    var INGREDIENTS__LIST = document.getElementById('ingredientsList');
    INGREDIENTS__LIST.querySelector('.recipe-main__articleDetail-title').innerHTML = RECIPE.ingredients[0].product;
    INGREDIENTS__LIST.querySelector('.recipe-main__articleDetail-brand').innerHTML = RECIPE.ingredients[0].brand;
    INGREDIENTS__LIST.querySelector('.recipe-main__articleDetail-weigth').innerHTML = RECIPE.ingredients[0].quantity;
    INGREDIENTS__LIST.querySelector('.recipe-main__quantityField').value = RECIPE.ingredients[0].items;
    INGREDIENTS__LIST.querySelector('.recipe-main__value').innerHTML = Number(RECIPE.ingredients[0].price).toFixed(2).replace('.', ',') + RECIPE.currency;
    RECIPE.ingredients.forEach(function (ingredient, index) {
        ingredient.id = "ingredient-" + (index + 1);
        if (index > 0) {
            var newItem = document.querySelector('.recipe-main__ingredient').cloneNode(true);
            INGREDIENTS__LIST.appendChild(newItem);
            newItem.id = "ingredient-" + (index + 1);
            newItem.querySelector('.recipe-main__articleDetail-title').innerHTML = ingredient.product;
            newItem.querySelector('.recipe-main__articleDetail-brand').innerHTML = ingredient.brand || '';
            newItem.querySelector('.recipe-main__articleDetail-weigth').innerHTML = ingredient.quantity;
            newItem.querySelector('.recipe-main__quantityField').value = ingredient.items.toString();
            newItem.querySelector('.recipe-main__value').innerHTML = Number(ingredient.price).toFixed(2).replace('.', ',') + RECIPE.currency;
        }
    });
    console.log(RECIPE);
    addEventListeners();
};
var catchRecipeNameAndDetails = function () {
    document.getElementById('title').innerHTML = RECIPE.name;
    document.getElementById('shipping').innerHTML = RECIPE['shipping-cost'].toFixed(2).replace('.', ',') + RECIPE.currency;
};
var catchData = function () {
    catchRecipeNameAndDetails();
    catchIngredients();
    updateTotalQuantities();
    updateTotalCosts();
};
var INITIATE = function () {
    fetch(EXERCISE_URL)
        .then(function (response) { return response.json(); })
        .then(function (responseJSON) {
        RECIPE = responseJSON.recipe;
        catchData();
    })
        .catch(function (error) {
        console.log('Failed when trying to fetch data from servers.');
        console.log('Reason: ', error);
        console.log('Serving data from local.');
        fetch('./scripts/database.json')
            .then(function (response) { return response.json(); })
            .then(function (responseJSON) {
            RECIPE = responseJSON.recipe;
            catchData();
        });
    });
};
INITIATE();
