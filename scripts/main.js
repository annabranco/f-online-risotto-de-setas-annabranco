'use strict';

const EXERCISE_URL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';
let RECIPE;

/**
 * Como yo uso arrow functions, para entender la lógica de ese código recomiendo
 * que sea lido de bajo para arriba.
 */

// ======== Deficición de las funcionalidades secundarias (derivadas de eventos)

/* [ 9 ] */ const updateTotalCosts = () => {
  const allPriceFields = document.querySelectorAll( '.recipe-main__value' );
  const shippingCost = RECIPE[ 'shipping-cost' ];
  let   subtotal       = 0;
  let   total          = 0;

  allPriceFields.forEach( priceField => total += Number( priceField.innerHTML.slice( 0, priceField.innerHTML.length - 1 ) ));
  document.getElementById( 'subtotal' ).innerHTML = total.toFixed( 2 ) + RECIPE.currency;
  document.getElementById( 'total' ).innerHTML = ( total + shippingCost ).toFixed( 2 ) + RECIPE.currency;
  document.getElementById( 'totalButton' ).innerHTML = ( total + shippingCost ).toFixed( 2 ) + RECIPE.currency;
};

/* [ 8 ] */ const updateTotalQuantities = () => {
  const allQuantityFields = document.querySelectorAll( '.recipe-main__quantityField' );
  let   total             = 0;

  allQuantityFields.forEach( quantityField => total += Number( quantityField.value ));
  document.getElementById( 'quantity' ).innerHTML = total;
};

/* [ 7 ] */ const determineCosts = ( ingredientId, quantity ) => {
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

/* [ 6 ] */ const handleCheckboxClick = clickEvent => {
  const thisIngredient = clickEvent.currentTarget.parentElement;

  if ( clickEvent.currentTarget.checked ) {
    thisIngredient.querySelector( '.recipe-main__quantityField' ).value = 1;
    thisIngredient.querySelector( '.recipe-main__value' ).innerHTML = determineCosts( thisIngredient.id, 1 ); // ver [ 7 ]
  } else {
    thisIngredient.querySelector( '.recipe-main__quantityField' ).value = 0;
    thisIngredient.querySelector( '.recipe-main__value' ).innerHTML = determineCosts( thisIngredient.id, 0 ); // ver [ 7 ]
  }
  updateTotalQuantities(); // ver [ 8 ]
  updateTotalCosts();      // ver [ 9 ]
};

/* [ 5 ] */ const handleQuantityInputChange = changeEvent => {
  const thisIngredient = changeEvent.currentTarget.parentElement;
  const quantity       = changeEvent.currentTarget.value;

  thisIngredient.querySelector( '.recipe-main__value' ).innerHTML = determineCosts( thisIngredient.id, quantity );

  if ( thisIngredient.querySelector( '.recipe-main__checkbox' ).checked === false ) {
    thisIngredient.querySelector( '.recipe-main__checkbox' ).checked = true;
  }
  updateTotalQuantities(); // ver [ 8 ]
  updateTotalCosts();      // ver [ 9 ]
};

// -----------------------------------------------------------------------------

// ======== Añade funcionalidades (eventos) a la página ========================

/* [ 4 ] */ const addEventListeners = () => {
  const CHECKBOXES      = document.querySelectorAll( '.recipe-main__checkbox' );
  const QUANTITY_INPUTS = document.querySelectorAll( '.recipe-main__quantityField' );

  CHECKBOXES.forEach( checkbox => {
    checkbox.addEventListener( 'click', handleCheckboxClick );
  });

  QUANTITY_INPUTS.forEach( input => {
    input.addEventListener( 'input', handleQuantityInputChange );
  });
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
  updateTotalQuantities();     // ver [ 8 ]
  updateTotalCosts();          // ver [ 9 ]
};

// -----------------------------------------------------------------------------

// ================== Inicía la ejecución del código ===========================

/* [ 0 ] */ const INITIATE = () => {
  fetch( EXERCISE_URL )
    .then( response => response.json())
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
