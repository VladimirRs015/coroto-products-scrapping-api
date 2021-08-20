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

      const category_id = $(element).find("a").attr("href");

      return { category_id, category };
    })
    .toArray();
  return categories;
}
