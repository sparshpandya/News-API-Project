import React from 'react'

// fetching all the countries from the API
const FetchCountries = async() => {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const result = await response.json();
        if (result) {
          // returning the news array
          return result;
        } else {
          console.log("Oops! Something went wrong, please try again after some time!!");
        }
      } catch (e) {
        console.error(e);
      }
}

export default FetchCountries
