const express = require("express");
const app = express();
const PORT = process.env.PORT || 3032;

app.use(express.static("public"));

require("./src/operator/index.js");

app.all("*", (req, res) => {
  res.send("AEfiat rocks");
});

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
