const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv-flow");
dotenv.config();

const app = express();

//constants
const port = process.env.PORT || 3000;
const isDevelopment = process.env.NODE_ENV === "development";

//init server config
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//router
const router = require("./src/routes");
app.use("/something", router.somethingRoutes);

//static files
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

//static web page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

//starting server
if (isDevelopment) {
  app.listen(port, () => {
    console.log("* This server is running on development mode *");
    console.log(`Server on port ${port}`);
  });
} else {
  //THIS IS IN CASE THAT EN HTTPS IS REQUIRED
  const https = require("https");
  const fs = require("fs");

  const https_options = {
    key: fs.readFileSync(`${process.env.CERTS_PATH}/privkey.pem`),
    cert: fs.readFileSync(`${process.env.CERTS_PATH}/fullchain.pem`),
    ca: [
      fs.readFileSync(`${process.env.CERTS_PATH}/bundle.pem`),
      fs.readFileSync(`${process.env.CERTS_PATH}/chain.pem`),
    ],
  };

  //starting production server
  https.createServer(https_options, app).listen(port);
}
