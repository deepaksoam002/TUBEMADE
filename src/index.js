import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});
const port = process.env.PORT || 8001;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`sever is running on https://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(`Monogodb connection error`, err);
  });
