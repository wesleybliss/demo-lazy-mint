#!/bin/sh

CD="`pwd`"
SOURCE="`pwd`/build/contracts/DSPX.json"
TARGET="`pwd`/../client/contracts/"
CLIENT="`pwd`/../client"

if [[ ! -d "$TARGET" ]]; then
    echo "Could not find client at $TARGET. Not copying contracts."
    exit 0
fi

cp "$SOURCE" "$TARGET"

cd "$CLIENT"
yarn minify:contracts

cd "$CD"
