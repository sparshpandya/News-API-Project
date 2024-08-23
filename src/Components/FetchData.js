import React from 'react'

// function to fetch the data from the news API
const FetchData = async(url) => {
    try {
        const response = await fetch(url);
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

export default FetchData
