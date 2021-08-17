import fetch from "node-fetch";
import cheerio from "cheerio";

const ENDPOINT_MAIN_URL = "https://www.corotos.com.do";
const SEARCHES_ENDPOINT = `${ENDPOINT_MAIN_URL}/k`;
const SUGGESTIONS_ENDPOINT = `${ENDPOINT_MAIN_URL}/listings/autocomplete?s=`;

async function getRawDataFromUrl(url) {
  return await fetch(url).then((res) => res.text());
}

function getProducts(rawdata) {
  const $ = cheerio.load(rawdata, null, false);
  return $(".listing__item")
    .map((index, element) => {
      const [, image, _] = $(element)
        .find(".item__image")
        .attr("style")
        .split("'");

      const title = $(element)
        .find(".item__title")
        .first()
        .text()
        .toString()
        .replace(/\n/g, "");

      const price = $(element).find(".item__price-amount").text();
      const sellerName = $(element)
        .find(".item__seller")
        .text()
        .replace(/\n/g, "");
      return {
        image,
        title,
        price: Number(price !== "Gratis" ? price.replace(/,/g, "") : 0),
        currencyPrice: price,
        sellerName,
      };
    })
    .toArray();
}

export async function GetProductsFromCorotos({ page, search = "" } = {}) {
  // console.log(page,);
  if (search && !page) {
    return getProducts(
      await getRawDataFromUrl(`${SEARCHES_ENDPOINT}/${search}`)
    );
  } else if (search && page) {
    return getProducts(
      await getRawDataFromUrl(`${SEARCHES_ENDPOINT}/${search}/?page=${page}`)
    );
  } else if (page) {
    return getProducts(
      await getRawDataFromUrl(`${ENDPOINT_MAIN_URL}/?page=${page})`)
    );
  } else {
    return getProducts(await getRawDataFromUrl(ENDPOINT_MAIN_URL));
  }
}

export function GetSuggestion(word) {
  return fetch(`${SUGGESTIONS_ENDPOINT}${word}`).then((res) => {
    if (res.ok) return res.json();
    else throw new Error(res.statusText);
  });
}

// You can also get quick sample by just going to the corotos home page and
// pasting this peace of code to the console you'll get a json in your clipboard
// you just have to past it into a file and used whatever you whant

/*
  copy($$('.listing__item').map(el=>{
    return {
            image:el.querySelector('.item__image').style["background-image"],
            title:el.querySelector('.item__title a').innerText,
            seller:el.querySelector('.item__seller-name').innerText,
            sellerProfile:el.querySelector('.item__seller-avatar').href
    }
  }))
*/
