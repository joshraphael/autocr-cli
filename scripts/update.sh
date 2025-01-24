#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export SHA="f6f7cfeb4e621b7bcc3016cbf478665117f506d0"

for file in "achievements.js" "logic.js" "feedback.js"; do
    rm -f ${file}
    wget -O "${file}" "${URL}/${SHA}/AutoCR/js/${file}"
done