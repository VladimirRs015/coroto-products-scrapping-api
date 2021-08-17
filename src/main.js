import express from "express";
import {
  GetSuggestion,
  GetProductsFromCorotos,
} from "./scripts/scraping-corotos.js";

import CONFIG from "./config.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/products", (req, res) => {
  const { page, search } = req.query;

  return GetProductsFromCorotos({ page, search })
    .then((products) => {
      return res.status(200).json(products);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send("Something went wrong trying to get products");
    });
});

app.get("/suggestions", (req, res) => {
  const { word } = req.query;
  GetSuggestion(word || "").then((suggestions) => {
    return res.status(200).json({
      suggestions,
    });
  });
});

app.listen(CONFIG.PORT, () => console.log("Server on port ", CONFIG.PORT));
