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
if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
var _scannerIsRunning = false;
function startScanner() {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#scanner-container"),
        constraints: {
          width: 375,
          height: 320,
          facingMode: "environment"
        }
      },
      decoder: {
        readers: [
          "code_128_reader"
        ],
        debug: {
          showCanvas: true,
          showPatches: true,
          showFoundPatches: true,
          showSkeleton: true,
          showLabels: true,
          showPatchLabels: true,
          showRemainingPatchLabels: true,
          boxFromPatches: {
            showTransformed: true,
            showTransformedBox: true,
            showBB: true
          }
        }
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
  
  //called for each frame after the processing is done. 
  Quagga.onProcessed(function(result) {
    
    var drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      //console.log("processed result", result);
      //console.log("processed result.boxs===", result.boxes);
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width")),
          parseInt(drawingCanvas.getAttribute("height"))
        );
        result.boxes
          .filter(function(box) {
            console.log('Filtering the results box', result.boxes)
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
        console.log('ON THE RESULT . BPOX ==', result.box)
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
          color: "#00F",
          lineWidth: 2
        });
      }
      console.log("result.codeResult==", result.codeResult)
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
