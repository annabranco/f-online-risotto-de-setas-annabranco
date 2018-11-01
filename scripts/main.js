'use strict';

const EXERCISE_URL = 'https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json';
let RECIPE;

fetch( EXERCISE_URL )
  .then( response => response.json() )
  .then( responseJSON => {
    RECIPE = responseJSON.recipe;
    console.log( RECIPE );

  })
  .catch( error => error );