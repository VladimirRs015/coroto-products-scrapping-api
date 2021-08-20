import cheerio from "cheerio";
import { SINGLE_ITEM_DETAILS } from "./enpoints.js";
import { getRawDataFromUrl } from "./main.js";
import extractUserData from "./extractUserData.js";

export default function getItemDetails(id) {
  return getRawDataFromUrl(`${SINGLE_ITEM_DETAILS}/${id}`).then((document) => {
    const $ = cheerio.load(document);
    const description = $(".post__specs").next().nextUntil(".banner-ad-detail");
    const descriptionFormat = description.toString();
    const descriptionText = description.text();
    const postDate = $(".post__date").text().replace("Publicado: ", "");

    const images = $(".carousel-cell > img")
      .map((_, el) => el.attribs.src)
      .toArray();

    const specs = $(".specs__item")
      .map((_, el) => {
        const key = $(el).find(".specs__label").text();
        const value = $(el).find(".specs__value").first().text();
        return { key, value };
      })
      .toArray()

      .reduce((specs, current) => {
        const { key, value } = current;
        specs[key] = value;
        return specs;
      }, {});

    const relatedItems = $(".listing__item")
      .map((i, el) => {
        const [id] = $(el).find(".item__image").attr("href").split("?from_");
        return {
          id,
          ...extractUserData($, el),
        };
      })
      .toArray();

    const [category, location] = $(".post__category-and-location li")
      .map((i, el) => {
        return el.children.filter((el) => {
          return el.type === "text" && el.data;
        });
      })
      .text()
      .split("\n\n")
      .map((el) => el.replace(/(\n|\s)/g, ""));

    const hasBenefits = Boolean($(".post__benefits").text());

    const benefits = hasBenefits
      ? $(".benefits__item")
          .map((i, el) => {
            return el.children.filter((el) => {
              return el.type === "text" && el.data;
            });
          })
          .text()
          .split("\n\n")
          .map((el) => el.replace(/^(\n|\s)|(\n|\s)$/g, ""))
      : [];

    return {
      images,
      specs,
      postDate,
      category,
      location,
      descriptionFormat,
      descriptionText,
      relatedItems,
      benefits,
    };
  });
}
