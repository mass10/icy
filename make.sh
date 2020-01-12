#!/bin/bash
yarn tsc
if [ -e ./DEPLOY ]; then
    cp dist/js/main.js ./DEPOY/
fi
