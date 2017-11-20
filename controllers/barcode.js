var invListings = require("../inv-listings.json");
var Quagga = require("quagga").default;
/**
 * GET /contact
 */
exports.barcodeGet = function(req, res) {
  res.render("barcode", {data: invListings,
    title: "Barcode", 
  });
};

exports.barcodePost = function(req, res) {
  console.log('whats the id==?', req.body.barcode)
  return res.redirect("/barode/1");
};


var _scannerIsRunning = false;
function startScanner() {
Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      // Or '#yourElement' (optional)
      target: document.querySelector("#scanner-container")
    },
    decoder: {
      readers: ["code_128_reader"]
    }
  },
  function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
  }
);
}