const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const mongoose = require("mongoose");
const app = express();


app.use(bodyParser.json());


mongoose.connect(
    "mongodb+srv://RahulChauhan:3aDm5xdCx8MiuHql@cluster0.xzyyibs.mongodb.net/loginProject",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch( err => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});