#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export SHA="275fd6713e3dcad6338acd4fe0d519d9ff726bec"

for file in "achievements.js" "logic.js" "feedback.js"; do
    rm -f ${file}
    wget -O "${file}" "${URL}/${SHA}/AutoCR/js/${file}"
done