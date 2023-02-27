let express = require("express");
let path = require("path");
var bodyParser = require("body-parser");
let cors = require("cors");

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
enableStaticFileServer(app, "./dist/pwa-app", "/");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/pwa-app/index.html"));
});

enableCORS(app);
app.use(cors());
function enableStaticFileServer(expressInstance, folderName, route) {
  expressInstance.use(route, express.static(path.join(__dirname, folderName)));
}
function enableCORS(expressInstance) {
  expressInstance.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, timeZone"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    next();
  });
}

app.listen(8000, () => {
  console.log("App listening on port : ", 8000);
});
