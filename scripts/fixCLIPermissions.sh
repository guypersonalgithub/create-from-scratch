#!/bin/sh
FILE="./typescript/clis/index.js"

if [ ! -x "$FILE" ]; then
  echo "Making $FILE executable"
  chmod +x "$FILE"
else
  echo "$FILE is already executable, skipping chmod"
fi