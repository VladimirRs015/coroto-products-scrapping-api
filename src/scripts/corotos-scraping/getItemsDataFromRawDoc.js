import cheerio from "cheerio";
import extractUserData from "./extractUserData.js";

export default function getItemsDataFromRawDoc(rawdata) {
  const $ = cheerio.load(rawdata, null, false);

  return $(".listing__item")
    .map((i, element) => {
      let [id] = $(element)
        .find(".item__image")
        .attr("href")
        .split("&render_time");
      const sellerType = $(element).attr("data-seller-type");

      return {
        ...extractUserData($, element),
        id,
        sellerType: sellerType ? sellerType : "",
      };
    })
    .toArray();
}
