# MALLGRABBER
__steal google streetview panorama images__

currently doesnt work with zoom level 5, we can't stitch together an image that big but it will download the tiles into the repo/downloads folder

## install
writen using node v12.13.1
- in a terminal, change directory into this git repo!
- run `npm install`

## use
run the command with node directly:

`node index.js [name prefix] [pano id] [zoom (1-5)]`

__pano-what??__
the panoid is googles ID for each 360 panorama. if you open the developer console and search panoid in the networktab you'll see many requests as you move the view.

looking at the urls in the network console:

![](panoid_example.jpg)

## image library
for reference we use 'images' from npm. very good library doesnt need any bullshit imagemagick preinstalls or anything
https://github.com/zhangyuanwei/node-images