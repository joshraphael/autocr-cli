#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export SHA="0a1dd5dfb87e8293c575641b321dcfab286c0cd3"

for file in "achievements.js" "logic.js" "feedback.js"; do
    rm -f ${file}
    wget -O "${file}" "${URL}/${SHA}/AutoCR/js/${file}"
done