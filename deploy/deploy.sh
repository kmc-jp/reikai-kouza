#!/bin/bash

rsync -acvz $(pwd)/dist/*.js ec2-user@miyama:/home/ec2-user/.local/bin/reikai-kouza

# サーバー再起動
ssh ec2-user@miyama "kill $(ssh ec2-user@miyama "ps aux | grep node" | grep background | awk '{ print $2 }')"
timeout 3 ssh ec2-user@miyama "nohup node ~/.local/bin/reikai-kouza/background.js &" || exit 0
