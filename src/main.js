import express from "express";
import cors from "cors";

import {
  getCategoriesData,
  getItemsFromCorotos,
  getItemsSuggestionAutocomplete,
  getSubcategories,
  getItemDetails,
} from "./scripts/corotos-scraping/index.js";

import CONFIG from "./config.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
);

app.get("/dev/v1/listing", (req, res) => {
  const { page, search, filter } = req.query;
  return getItemsFromCorotos({ page, search })
    .then((items) => {
      console.log(items);
      return res.status(200).json(items);
    })
    .catch((error) => {
      console.log("TODO ", error.message);
      res.status(400).send("Something went wrong trying getting items");
    });
});
app.get("/v1/listing", (req, res) => {
  const { page, search, filter } = req.query;
  return getItemsFromCorotos({ page, search })
    .then((items) => {
      console.log(items);
      return res.status(200).json(items);
    })
    .catch((error) => {
      console.log("TODO ", error.message);
      res.status(400).send("Something went wrong trying getting items");
    });
});

app.get("/v1/suggestions/autocomplete", (req, res) => {
  const { word } = req.query;
  getItemsSuggestionAutocomplete(word || "").then((suggestions) => {
    return res.status(200).json({
      suggestions,
    });
  });
});

// https://www.corotos.com.do/shops?q%5Btitle_cont%5D=&q%5Bprovince_id_eq%5D=29&q%5Bcategory_id_eq%5D=3

app.get("/development/", (req, res) => {});

app.get("/v1/details/:id", (req, res) => {
  const { id } = req.params;
  getItemDetails(id)
    .then((details) => {
      res.json(details);
    })
    .catch((error) => {
      res.status(500).send("Something went wrong");
      console.log("TODO ", error.message);
    });
});

app.get("/v1/listing/categories", (req, res) => {
  return getCategoriesData()
    .then((categories) => {
      res.json({ categories });
    })
    .catch((error) => {
      console.log("TODO ", error);
      res.send("Semething went wrong during the request");
    });
});

app.get("/v1/listing/subcategories/:categoryid", (req, res) => {
  const { categoryid } = req.params;
  return getSubcategories(categoryid)
    .then((subcategories) => {
      res.json(subcategories);
    })
    .catch((error) => {
      console.log("TODO ", error.message);
    });
});

// shops?q[title_cont]=&q[province_id_eq]&q[category_id=3]
// todo
// reverse Corotos Shops

app.get("/query", (req, res) => {
  console.log(req.query);
  res.json(req.query);
});

app.get("/health", (_, res) => {
  res.send("ok");
});

app.listen(CONFIG.PORT, () => console.log("Server on port ", CONFIG.PORT));
