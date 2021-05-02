console.log('mallgrabbers unite on planet earth1!! shoutout fantasia malware krew!!!!')

const wget = require('node-wget-promise');
const path = require('path')
const fs_promise = require('fs').promises;
const fs = require('fs')
const images = require('images')

const DEBUG_DRAW_PINK_LINES = false

let scratch_dir = path.join(__dirname,'scratch')

// ensure working directories
let downloads = path.join(__dirname,'downloads')
if (!fs.existsSync(downloads)){
  fs.mkdirSync(downloads);
}
let output = path.join(__dirname,'output')
if (!fs.existsSync(output)){
  fs.mkdirSync(output);
}

if (process.argv.length < 5) {
  console.log(" ")
  console.log( "need arguments bitch:")
  console.log("node index.js  [prefix] [panoid] [zoom]")
  process.exit(1)
}

// let s = 'https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid=Mq-8d-CoiFnoVK7f2T8jVg&x=2&y=4&zoom=4&nbt=1&fover=2'
let prefix = process.argv[2]
let panoid = process.argv[3]
let zoom = process.argv[4]
let inside_mode = process.argv.length > 5

if (inside_mode) {
  console.log("Doing INSIDE mode")
}

let downloadFolder = path.join(__dirname, 'downloads', `${prefix}_z${zoom}`)

fs.rmdir(downloadFolder, { recursive: true }, () => {
  if (!fs.existsSync(downloadFolder)){
    fs.mkdirSync(downloadFolder);
  }
  main()  
})

function makeURL(panoid, x, y, zoom) {
  if (inside_mode) {
    return `https://lh3.ggpht.com/p/${panoid}=x${x}-y${y}-z${zoom}`
  }
  return `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=maps_sv.tactile&panoid=${panoid}&x=${x}&y=${y}&zoom=${zoom}&nbt=1&fover=2`
}

function getDownloadUrl(destination, prefix, zoom, x,y){
  return path.join(destination, `${prefix}_z${zoom}_x${x}_y${y}.jpg`)
}

function getOutputFilename(prefix, zoom, x,y){
  return `${prefix}_z${zoom}_x${x}_y${y}.jpg`
}

async function main () {
  const iter = getZoomIterators(zoom)
  console.log(" ")
  for (let y = 0; y <= iter.y; y++) {
    for (let x = 0; x <= iter.x; x++) {
      const url = makeURL(panoid, x, y, zoom)
      process.stdout.write("\r\x1b[K")
      
      let total = (iter.x+1)*(iter.y+1)
      for (let c = 0; c < total; c++) {
        if(c <= (x)+(y)*(iter.x+1)) {
          process.stdout.write("■")
        } else {
          process.stdout.write("□")
        }
      }

      await wget(url, {output: getDownloadUrl(downloadFolder, prefix, zoom, x, y)})
      .catch((e) => {
        console.log(e)
        process.exit(1)
      })
      .then(() => {
       
      })

    }
    
  }
  console.log(" ")
  console.log("PIRACY COMPLETE 😈 ")
  console.log("magic time! writing macro image to output directory")

  const outputImage = images((iter.x+1)*512, (iter.y+1)*512).fill(0xff,0x00,0xff)

  for (let y = 0; y <= iter.y; y++) {
    for (let x = 0; x <= iter.x; x++) {
      if (DEBUG_DRAW_PINK_LINES) {
        outputImage.draw(images(getDownloadUrl(downloadFolder, prefix, zoom, x,y)).resize(506,506), x*512, y*512)
      } else {
        outputImage.draw(images(getDownloadUrl(downloadFolder, prefix, zoom, x,y)), x*512, y*512)
      }
    }
  }
  outputImage.save(path.join(output, `${prefix}_z${zoom}.jpg`), {               //Save the image to a file, with the quality of 50
      quality : 50                
  })

  console.log("Saved to "+path.join(output, `${prefix}_z${zoom}.jpg ! done!`))
  

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
