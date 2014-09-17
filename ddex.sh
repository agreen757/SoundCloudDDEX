#!/bin/bash
git clone https://github.com/agreen757/SoundCloudDDEX
echo "copying resources into the SoundCloudDDEX folder"
cp resources/*.* ./SoundCloudDDEX
cp *.csv ./SoundCloudDDEX
echo "installing modules..."
cd SoundCloudDDEX
npm install
echo "ready to run..."

