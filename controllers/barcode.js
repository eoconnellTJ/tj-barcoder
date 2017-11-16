/**
 * GET /contact
 */
exports.barcodeGet = function(req, res) {
    console.log('running barcode')
  res.render("barcode", {
    title: "barcode"
  });
};
