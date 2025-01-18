import express from "express";
import "dotenv/config";
import connectToDatabase from "./config/database";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import { autoDelete } from "./utils/autoDelete";

const app = express();

app.use(express.json());
app.use(express.static("uploads"));
// app.use(express.static("temp"));

app.use("/api/v1", routes);

//global error handler
app.use(errorHandler);

setInterval(() => {
  autoDelete();
}, Number(process.env.INTERVAL)); // convert string to number

const port = process.env.PORT || 3000;

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
