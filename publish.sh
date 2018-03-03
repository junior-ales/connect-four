#!/bin/bash

cd ~/Projects/connect-four
yarn prod
cp ./dist/* ~/Projects/junior-ales.github.io/connect4/
cd ~/Projects/junior-ales.github.io/connect4/
git add .
git cm "publish connect4 v$1"
git push origin master
