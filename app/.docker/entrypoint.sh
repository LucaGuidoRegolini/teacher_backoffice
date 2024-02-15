#!/bin/bash

npm install

npm run build

rm -rf src

npm run start
