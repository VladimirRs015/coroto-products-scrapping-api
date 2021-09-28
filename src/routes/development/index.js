import { Router } from "express";
import { open } from "fs/promises";

const router = Router();

const handle = await open("./development_cache.json", "as+");

app.get("/dev/v1/listing", async (req, res) => {
  const { page, search, filter } = req.query;
  const filehandle =  
  return getItemsFromCorotos({ page, search })
    .then(({ products }) => {
      cache.then((handle) => {
        const buffer = Buffer.from();
        handle.write(products);
      });
      return res.status(200).json(items);
    })
    .catch((error) => {
      console.log("TODO ", error.message);
      res.status(400).send("Something went wrong trying getting items");
    });
});
export default router;
