console.log("connected barcoder");

//TO GET THE CAMERA WORKING
// navigator.getUserMedia(
//   { video: true },
//   stream => {
//     video.src = window.URL.createObjectURL(stream);
//     video.play();
//   },
//   err => {
//     console.log(err);
//   }
// );
if (window.location.pathname === "/barcode") {
  document.querySelector("#qr-submit-form").addEventListener("submit", e => {
    e.preventDefault();
    var qrcode = document.querySelector("#input-qr-code").value;
    console.log("submitted", qrcode, e);
  });

  if (
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  ) {
    var _scannerIsRunning = false;

    function startScanner() {
      var foundCode = { found: false, code: "" };
      Quagga.init(
        {
          numOfWorkers: navigator.hardwareConcurrency,
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#scanner-container"),
            constraints: {
              width: 640,
              height: 320,
              facingMode: "environment"
            }
          },
          decoder: {
            readers: ["code_128_reader", "upc_reader", "upc_e_reader"],
            debug: {
              showCanvas: true,
              showPatches: true,
              showFoundPatches: true,
              showSkeleton: true,
              showLabels: true,
              showPatchLabels: true,
              showRemainingPatchLabels: true,
              drawBoundingBox: false,
              showFrequency: false,
              drawScanline: false,
              showPattern: false,
              boxFromPatches: {
                showTransformed: true,
                showTransformedBox: true,
                showBB: true
              }
            },
            patchSize: "medium",
            multiple: false
          }
        },
        err => {
          if (err) {
            console.log(err);
            return;
          }

          console.log("Initialization finished. Ready to start");
          Quagga.start();

          // Set flag to is running
          _scannerIsRunning = true;
        }
      );

      Quagga.onProcessed(result => {
        var drawingCtx = Quagga.canvas.ctx.overlay,
          drawingCanvas = Quagga.canvas.dom.overlay;
        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute("width")),
              parseInt(drawingCanvas.getAttribute("height"))
            );
            result.boxes
              .filter(box => {
                return box !== result.box;
              })
              .forEach(box => {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: "green",
                  lineWidth: 2
                });
              });
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: "#00F",
              lineWidth: 2
            });
          }

          if (result.codeResult && result.codeResult.code) {
            foundCode.found = true;
            foundCode.code = result.codeResult.code;
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: "x", y: "y" },
              drawingCtx,
              { color: "red", lineWidth: 3 }
            );
          }
        }
        Quagga.onDetected(result => {
          console.log(
            "Barcode detected and processed : [" + result.codeResult.code + "]",
            result
          );
          //barcode(result.codeResult.code);
        });
      });
    }
    var barcode = detectedCode => {
      console.log("within barcode", detectedCode);
      return detectedCode;
    };

    if (document.querySelector(".barcode-page")) {
      document.getElementById("btn").addEventListener(
        "click",
        () => {
          if (_scannerIsRunning) {
            Quagga.stop();
          } else {
            startScanner();
          }
        },
        false
      );
    }
  }

  document.querySelector("#startScan").addEventListener("click", startScanner);
}


