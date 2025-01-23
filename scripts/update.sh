#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export SHA="7704d3ad9d74db55808d0114357671665fc6819b"

for file in "achievements.js" "logic.js" "feedback.js"; do
    rm -f ${file}
    wget -O "${file}" "${URL}/${SHA}/AutoCR/js/${file}"
done