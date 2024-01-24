# web-gphoto2 Angular Component
## Requirements:
### web-gphoto2
```
npm install web-gphoto2
```

### Cropperjs

```
npm install cropperjs@next
```

## How to use
### Connect camera as WebUSB Device
#### List WebUSB devices on button click

```
const pairing = document.getElementById('pairing_button');

// Filters to show a filtered list of the usb devices
const filters = [];
pairing.addEventListener('click', function() {
  navigator.usb
    .requestDevice({ 'filters': filters })
// Now do what you want with the device
    .then(device => connectCamera(device));
});
```
#### Connect the paired camera device
```
let camera
async function connectCamera(device) {
  try {
    camera = new Camera();
    await camera.connect();
  } catch (e) {
    console.warn(e);
  }
}
```

### Use the camera supported operations
#### Get the possible operations with:
```
await camera.getSupportedOps()
```

#### Get the current camera configuration with:
```
await camera.getConfig()
```
#### Capture the camera preview
```
// Capture the preview as Blob
let blob = await camera.capturePreviewAsBlob();
```

#### Capture the camera full resolution picture
```
// This can be used in the same way as Blob above, but also has extra information such as filename useful for download.
const capture = await camera.captureImageAsFile();
```

### Show the results
#### How to draw the blob on a html canvas element
```
var canvas = document.getElementById('canvas');
async function drawBlob(blob) {
  createImageBitmap(blob).then(imageBitmap => {
    canvas.getContext('2d').drawImage(imageBitmap, 0, 0, width, height)
  })
}
```
#### How to stream the preview blob on the canvas
```
// use preview == 1 or 0 to start/stop the preview
async function streamPreview() {
  do {
    console.log('preview=', preview)
    if (camera) {
      try {
        let blob = await camera.capturePreviewAsBlob();
        await new Promise(resolve => requestAnimationFrame(resolve));
        drawBlob(blob)
      } catch (err) {
        console.error('Could not refresh preview:', err);
      }
    }
    else {
      await delay(2000); // Wait for camera delay in initialization and when switching between capture/preview mode
    }
  }
  while (preview == 1)
}
```

