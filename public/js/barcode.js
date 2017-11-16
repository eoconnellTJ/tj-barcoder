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
if (
  navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function"
) {
  
  var _scannerIsRunning = false;

  function startScanner() {
    const workers = navigator.hardwareConcurrency;
    console.log('how many workers==', workers)
    Quagga.init(
      { numOfWorkers: 0,
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#scanner-container"),
          constraints: {
            width: 480,
            height: 320,
            facingMode: "environment"
          }
        },
        frequency: 2,
        decoder: {
          readers: [
            "code_128_reader",
            "upc_reader",
            "upc_e_reader"
          ],
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
          multiple: false
        }
      },
      function(err) {
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

    Quagga.onProcessed(function(result) {
      
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        console.log("processed==", result);
        console.log("processed result.boxes==", result.boxes);
        
        if (result.boxes) {
          
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function(box) {
              return box !== result.box;
            })
            .forEach(function(box) {
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
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    Quagga.onDetected(function(result) {
      console.log(
        "Barcode detected and processed : [" + result.codeResult.code + "]",
        result
      );
    });

    var resultCollector = Quagga.ResultCollector.create({
      capture: true, // keep track of the image producing this result
      capacity: 20, // maximum number of results to store
      blacklist: [
        // list containing codes which should not be recorded
        { code: "3574660239843", format: "ean_13" }
      ],
      filter: function(codeResult) {
        // only store results which match this constraint
        // returns true/false
        // e.g.: return codeResult.format === "ean_13";
        return true;
      }
    });
    console.log("res collector", resultCollector);
    Quagga.registerResultCollector(resultCollector);
  }

  // Start/stop scanner
  document.getElementById("btn").addEventListener(
    "click",
    function() {
      if (_scannerIsRunning) {
        Quagga.stop();
      } else {
        startScanner();
      }
    },
    false
  );
}
document.querySelector("#startScan").addEventListener("click", startScanner);
