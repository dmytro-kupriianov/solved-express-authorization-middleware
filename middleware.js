const ROLES_FILE = __dirname + "/roles.txt";
const fs = require("fs");
const rawData = fs.readFileSync(ROLES_FILE);
var strippedRawData = `${rawData}`.trim();
const roles = JSON.parse(strippedRawData);

module.exports = (scope) => (req, res, next) => {
  var scopes = scope.split(".");
  let page = scopes[0];
  let action = scopes[1];
  const role = req.headers["x-role"];

  let rofilter = roles.filter((item) => item.role === role);
  rofilter = rofilter.length > 0 ? rofilter[0] : "";

  if (!rofilter || (rofilter && !rofilter.scopes[page])) {
    res.send(403);
  } else if (rofilter.scopes[page] && !rofilter.scopes[page].includes(action)) {
    res.send(403);
  } else {
    next();
  }
};
