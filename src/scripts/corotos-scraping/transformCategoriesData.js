import cheerio from "cheerio";

export default function transformCategoriesData(document) {
  const $ = cheerio.load(document);
  const categories = $(".filter__category > li:not(:first-of-type)")
    .map((i, element) => {
      const category_title = $(element)
        .first()
        .find("a")
        .map((i, el) => {
          return el.children.filter((el) => {
            return el.type === "text" && el.data;
          });
        })
        .text();
      const [, category] = category_title.split("\n");
      const [prefix, category_id, subcategory_id] = $(element)
        .find("a")
        .attr("href")
        .split("/")
        .filter((el) => (el ? el : false));
      const isSub = prefix === "sc";
      return { category_id: isSub ? subcategory_id : category_id, category };
    })
    .toArray();
  return categories;
}
