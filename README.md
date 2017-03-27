# Threedee

A toy photo booth that takes "[wiggle stereoscopic](https://en.wikipedia.org/wiki/Wiggle_stereoscopy)" 3D gifs in a 
browser using two webcams.

## How to use
1. You'll need Chrome, node, npm, and bower installed.
2. ```npm install```
3. ```bower install```
4. ```node server.js```
5. Load in Chrome: [https://localhost:8443](https://localhost:8443)
6. Add a security exception for the self-signed certificate
7. Press 'space' key

## What's with ...

### ... HTTPS and the included certificate/key?
At the time of construction, it used to be that some part of the cycle (webcam access, saving images from canvas, 
downloading the files) required HTTPS, but that seems to no longer be the case. It is left in because it appears to 
still work, even though it's a non-ideal setup.

### ... the Alice in Wonderland quotes?
This project was originally intended as a photo booth for a fairy woodland themed party, and the speech synthesised 
quotes add a little flavour.

### ... the message "touch the pads"?
The primary trigger for taking a photo was a pair of tinfoil pads connected to a 
[Makey Makey](http://www.makeymakey.com/).
