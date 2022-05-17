#!/bin/bash

yarn install
yarn docker:build:slack-api

echo -e "\nREADY\n\nhttp://localhost:5500/"

node docker/slack-api/dist/build_api_server.js
