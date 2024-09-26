const express = require("express");
const router = require("./router");
const app = express();
const port = 3001;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/", router);

app.listen(port, () => {
  console.log(`Trail stop server app listening on port ${port}`);
});
