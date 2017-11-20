var invListings = require("../inv-listings.json");
var Quagga = require("quagga").default;
console.log("quaqqa init on barcode js==", Quagga);
/**
 * GET /contact
 */
exports.barcodeGet = function(req, res) {
  console.log("running barcode", invListings);
  res.render("barcode", {data: invListings,
    title: "Barcode", 
  });
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