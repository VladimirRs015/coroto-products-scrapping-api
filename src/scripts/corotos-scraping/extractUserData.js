export default function extractUserData($, context) {
  const [, image, _] = $(context).find(".item__image").attr("style").split("'");

  const title = $(context)
    .find(".item__title")
    .first()
    .text()
    .toString()
    .replace(/\n/g, "");

  const price = $(context).find(".item__price-amount").text();
  const sellerName = $(context).find(".item__seller").text().replace(/\n/g, "");

  return {
    image,
    title,
    price: Number(price !== "Gratis" ? price.replace(/,/g, "") : 0),
    currencyPrice: price,
    sellerName,
  };
}
