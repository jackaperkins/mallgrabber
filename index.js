console.log('mallgrabbers unite on planet earth1!! shoutout fantasia malware krew!!!!')

const wget = require('node-wget-promise');
const path = require('path')
const fs_promise = require('fs').promises;
const fs = require('fs')

let scratch_dir = path.join(__dirname,'scratch')

let s = 'https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid=Mq-8d-CoiFnoVK7f2T8jVg&x=2&y=4&zoom=4&nbt=1&fover=2'
let panoid = 'Mq-8d-CoiFnoVK7f2T8jVg'
let zoom = 4
let prefix = "PREEEEEFIX"


let destination = path.join(__dirname, 'downloads', `${prefix}_z${zoom}`)

fs.rmdir( destination, { recursive: true }, () => {
  if (!fs.existsSync(destination)){
    fs.mkdirSync(destination);
  }
  main()  
})

function makeURL(panoid, x, y, zoom) {
  return `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid=${panoid}&x=${x}&y=${y}&zoom=${zoom}&nbt=1&fover=2`
}

async function main () {
  const iter = getZoomIterators(zoom)
  for (let x = 0; x <= iter.x; x++) {
    for (let y = 0; y <= iter.y; y++) {
      const url = makeURL(panoid, x, y, zoom)
      await wget(url, {output: path.join(destination, `${prefix}_z${zoom}_x${x}_y${y}.jpg`)})
      
    }
    
  }
}

function getZoomIterators(zoomLevel) {
  zoomLevel -= 1
  return [
    {x:1,y:0},
    {x:3,y:1},
    {x:6,y:3},
    {x:12,y:6},
    {x:25,y:12}    
  ][zoomLevel]
}
