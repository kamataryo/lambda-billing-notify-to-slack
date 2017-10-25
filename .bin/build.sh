#!/bin/bash

mkdir -p dist
cp ./package.json ./dist/
cp ./package-lock.json ./dist/
cp ./src/index.js ./dist/

pushd dist
npm install --production
zip ../package.zip ./*
popd
