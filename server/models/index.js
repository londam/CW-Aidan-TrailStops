const mongoose = require("mongoose");

const URL = "mongodb://localhost:27017/TrailStops";

async function main() {
  await mongoose.connect(URL);
}

main();

module.exports = mongoose;
