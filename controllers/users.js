var testJson = require("../test.json");

exports.getUser = function(req, res) {
  // console.log("running users", testJson);
  res.render("user", {data: testJson,
    title: "User"
  });
};
