'use strict';

const EXERCISE_URL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';
let RECIPE;

/**
 * Como uso arrow functions, para entender la lógica de ese código recomiendo
 * que sea leído de bajo para arriba.
 */


// ======== Definición de las funcionalidades secundarias (derivadas de eventos)

/* [ 10 ] */ const updateTotalCosts = () => {
  const allPriceFields = document.querySelectorAll( '.recipe-main__value' );
  const shippingCost = RECIPE[ 'shipping-cost' ];
  let   subtotal       = 0;
  let   total          = 0;

  allPriceFields.forEach( priceField => total += Number( priceField.innerHTML.slice( 0, priceField.innerHTML.length - 1 ) ));
  document.getElementById( 'subtotal' ).innerHTML = total.toFixed( 2 ) + RECIPE.currency;
  document.getElementById( 'total' ).innerHTML = ( total + shippingCost ).toFixed( 2 ) + RECIPE.currency;
  document.getElementById( 'totalButton' ).innerHTML = ( total + shippingCost ).toFixed( 2 ) + RECIPE.currency;
};

/* [ 9 ] */ const updateTotalQuantities = () => {
  const allQuantityFields = document.querySelectorAll( '.recipe-main__quantityField' );
  let   total             = 0;

  allQuantityFields.forEach( quantityField => total += Number( quantityField.value ));
  document.getElementById( 'quantity' ).innerHTML = total;
};

/* [ 8 ] */ const determineCosts = ( ingredientId, quantity ) => {
  for ( const _ingredient of RECIPE.ingredients ) {
    let costPerUnity;

    if ( _ingredient.id === ingredientId ) {
      costPerUnity = _ingredient.price;
      return ( costPerUnity * quantity ).toFixed( 2 ) + RECIPE.currency;
    }
  }
};

// -----------------------------------------------------------------------------

// ======== Deficición de las funcionalidades directas (eventos) ===============

/* [ 11 ] */ const buyIt  = () => {
  // Esa función simula el proceso de compra
  const total = document.getElementById( 'total' ).innerHTML;
  document.querySelector( '.main__wrapper' ).remove();

  const pleaseWait = document.createElement( 'img' );
  pleaseWait.setAttribute( 'src', 'images/loading.gif' );
  pleaseWait.classList.add( 'pleaseWait' );

  const pleaseWaitText = document.createElement( 'p' );
  pleaseWaitText.innerHTML = 'Procesando tu compra...';
  pleaseWaitText.classList.add( 'pleaseWaitText' );

  const thankYouText = document.createElement( 'p' );
  thankYouText.classList.add( 'thankU', 'hidden' );
  thankYouText.innerHTML = `El total de ${ total } ha sido debitado de tu tarjeta. 
  Gracias por tu compra.`;
  document.querySelector( '.header' ).append( thankYouText, pleaseWait, pleaseWaitText );

  setTimeout(() => {
    pleaseWait.classList.add( 'hidden' );
    pleaseWaitText.classList.add( 'hidden' );
    thankYouText.classList.remove( 'hidden' );
  }, 3000 );

};

/* [ 7 ] */ const handleToggleAll  = action => {
  const CHECKBOXES = document.querySelectorAll( '.recipe-main__checkbox' );
  let isNotChecked;

  action === 'deselect' ? isNotChecked = true : isNotChecked = false;

  CHECKBOXES.forEach( checkbox => checkbox.checked === isNotChecked && checkbox.click() );
};

/* [ 6 ] */ const handleCheckboxClick = clickEvent => {
  const thisIngredient = clickEvent.currentTarget.parentElement;

  if ( clickEvent.currentTarget.checked ) {
    thisIngredient.querySelector( '.recipe-main__quantityField' ).value = 1;
    thisIngredient.querySelector( '.recipe-main__value' ).innerHTML = determineCosts( thisIngredient.id, 1 ); // ver [ 8 ]
  } else {
    thisIngredient.querySelector( '.recipe-main__quantityField' ).value = 0;
    thisIngredient.querySelector( '.recipe-main__value' ).innerHTML = determineCosts( thisIngredient.id, 0 ); // ver [ 8 ]
  }
  updateTotalQuantities(); // ver [ 9 ]
  updateTotalCosts();      // ver [ 10 ]
};

/* [ 5 ] */ const handleQuantityInputChange = changeEvent => {
  const thisIngredient = changeEvent.currentTarget.parentElement;
  const thisCheckBox   = thisIngredient.querySelector( '.recipe-main__checkbox' );
  const quantity       = changeEvent.currentTarget.value;

  thisIngredient.querySelector( '.recipe-main__value' ).innerHTML = determineCosts( thisIngredient.id, quantity ); // ver [ 8 ]

  if ( thisCheckBox.checked === false ) {
    thisCheckBox.checked = true;
  } else if ( Number( quantity ) === 0 ) {
    thisCheckBox.checked = false;
  }

  updateTotalQuantities(); // ver [ 9 ]
  updateTotalCosts();      // ver [ 10 ]
};

// -----------------------------------------------------------------------------

// ======== Añade funcionalidades (eventos) a la página ========================

/* [ 4 ] */ const addEventListeners = () => {
  const CHECKBOXES      = document.querySelectorAll( '.recipe-main__checkbox' );
  const QUANTITY_INPUTS = document.querySelectorAll( '.recipe-main__quantityField' );
  const SELECT_ALL = document.getElementById( 'selectAll' );
  const DESELECT_ALL = document.getElementById( 'deselectAll' );
  const BUTTON_BUY = document.getElementById( 'buyIt' );

  CHECKBOXES.forEach( checkbox => {
    checkbox.addEventListener( 'click', handleCheckboxClick ); // ver [ 6 ]
  });

  QUANTITY_INPUTS.forEach( input => {
    input.addEventListener( 'input', handleQuantityInputChange ); // ver [ 5 ]
  });
  SELECT_ALL.addEventListener( 'click', () => handleToggleAll( 'select' ));     // ver [ 7 ]
  DESELECT_ALL.addEventListener( 'click', () => handleToggleAll( 'deselect' )); // ver [ 7 ]
  BUTTON_BUY.addEventListener( 'click', buyIt ); // ver [ 11 ]
};

// -----------------------------------------------------------------------------

// ====== Funciones estructurales, montan la estructura básica de la página ====

/* [ 3 ] */ const catchIngredients = () => {
  const INGREDIENTS__LIST = document.getElementById( 'ingredientsList' );

  INGREDIENTS__LIST.querySelector( '.recipe-main__articleDetail-title' ).innerHTML = RECIPE.ingredients[ 0 ].product;
  INGREDIENTS__LIST.querySelector( '.recipe-main__articleDetail-brand' ).innerHTML = RECIPE.ingredients[ 0 ].brand;
  INGREDIENTS__LIST.querySelector( '.recipe-main__articleDetail-weigth' ).innerHTML = RECIPE.ingredients[ 0 ].quantity;
  INGREDIENTS__LIST.querySelector( '.recipe-main__quantityField' ).value = RECIPE.ingredients[ 0 ].items;
  INGREDIENTS__LIST.querySelector( '.recipe-main__value' ).innerHTML = Number( RECIPE.ingredients[ 0 ].price ).toFixed( 2 ) + RECIPE.currency;

  RECIPE.ingredients.forEach(( ingredient, index ) => {
    ingredient.id = `ingredient-${ index + 1 }`;

    if ( index > 0 ) {
      const newItem = document.querySelector( '.recipe-main__ingredient' ).cloneNode( true );

      INGREDIENTS__LIST.appendChild( newItem );
      newItem.id = `ingredient-${ index + 1 }`;
      newItem.querySelector( '.recipe-main__articleDetail-title' ).innerHTML = ingredient.product;
      newItem.querySelector( '.recipe-main__articleDetail-brand' ).innerHTML = ingredient.brand || '';
      newItem.querySelector( '.recipe-main__articleDetail-weigth' ).innerHTML = ingredient.quantity;
      newItem.querySelector( '.recipe-main__quantityField' ).value = ingredient.items;
      newItem.querySelector( '.recipe-main__value' ).innerHTML = Number( ingredient.price ).toFixed( 2 ) + RECIPE.currency;
    }
  });
  console.log( RECIPE );
  addEventListeners(); // ver [ 4 ]
};

/* [ 2 ] */ const catchRecipeNameAndDetails = () => {
  document.getElementById( 'title' ).innerHTML = RECIPE.name;
  document.getElementById( 'shipping' ).innerHTML = RECIPE[ 'shipping-cost' ].toFixed( 2 ) + RECIPE.currency;
};

/* [ 1 ] */ const catchData = () => {
  catchRecipeNameAndDetails(); // ver [ 2 ]
  catchIngredients();          // ver [ 3 ]
  updateTotalQuantities();     // ver [ 9 ]
  updateTotalCosts();          // ver [ 10 ]
};

// -----------------------------------------------------------------------------

// ================== Inicía la ejecución del código ===========================

/* [ 0 ] */ const INITIATE = () => {
  fetch( EXERCISE_URL )
    .then( response => response.json() )
    .then( responseJSON => {
      RECIPE = responseJSON.recipe;
      catchData(); // ver [ 1 ]
    })
    .catch( error => {
      console.log( 'Failed when trying to fetch data from servers.' );
      console.log( 'Reason: ', error );
      console.log( 'Serving data from local.' );
      fetch( './scripts/database.json' )
        .then( response => response.json())
        .then( responseJSON => {
          RECIPE = responseJSON.recipe;
          catchData(); // ver [ 1 ]
        });
    });
};

// -----------------------------------------------------------------------------

INITIATE(); // ver [ 0 ]
