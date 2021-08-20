import fetch from "node-fetch";
import cheerio from "cheerio";
import {
  ENDPOINT_MAIN_URL,
  SEARCHES_ENDPOINT,
  SUGGESTIONS_ENDPOINT,
  ALl_CATEGORIES,
  CATEGORIES_ENDPOINT,
} from "./enpoints.js";

import getItemsDataFromRowDoc from "./getItemsDataFromRawDoc.js";

export async function getRawDataFromUrl(url) {
  return await fetch(url).then((res) => res.text());
}

// todo :
// get items to specify if the seller rather is a store or dealer
// add benefits to the response if the
export function getItemsSuggestionAutocomplete(word) {
  return fetch(`${SUGGESTIONS_ENDPOINT}${word}`).then((res) => {
    if (res.ok) return res.json();
    else throw new Error(res.statusText);
  });
}

export async function getItemsFromCorotos({ page, search = "" } = {}) {
  if (search && !page) {
    return getItemsDataFromRowDoc(
      await getRawDataFromUrl(`${SEARCHES_ENDPOINT}/${search}`)
    );
  } else if (search && page) {
    return getItemsDataFromRowDoc(
      await getRawDataFromUrl(`${SEARCHES_ENDPOINT}/${search}/?page=${page}`)
    );
  } else if (page) {
    return getItemsDataFromRowDoc(
      await getRawDataFromUrl(`${ENDPOINT_MAIN_URL}/?page=${page})`)
    );
  } else {
    return getItemsDataFromRowDoc(await getRawDataFromUrl(ENDPOINT_MAIN_URL));
  }
}

export function getCategoriesData() {
  return getRawDataFromUrl(ALl_CATEGORIES).then((document) => {
    return transformCategoriesData(document);
  });
}

export function getSubcategories(subcategory) {
  return getRawDataFromUrl(`${CATEGORIES_ENDPOINT}/${subcategory}`).then(
    (document) => {
      const [, ...subcateries] = transformCategoriesData(document);
      return subcateries;
    }
  );
}

// You can also get quick sample by just going to the corotos home page and
// pasting this peace of code to the console you'll get a json in your clipboard
// you just have to past it into a file and used whatever you whant

/*
copy($$('.listing__item').map(el=>{
  return {
    image:el.querySelector('.item__image').style["background-image"].split("'")[1],
    title:el.querySelector('.item__title a').innerText,
    seller:el.querySelector('.item__seller-name').innerText,
    sellerProfile:el.querySelector('.item__seller-avatar').href
  }
}))
*/
