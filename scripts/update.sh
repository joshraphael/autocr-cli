#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export SHA="26a88d95a5181ed0db0b213abfc5a488a14fcb3e"

for file in "achievements.js" "logic.js" "feedback.js"; do
    rm -f ${file}
    wget -O "${file}" "${URL}/${SHA}/AutoCR/js/${file}"
done