#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export OLD_SHA="26a88d95a5181ed0db0b213abfc5a488a14fcb3e"
export NEW_SHA="124c3d5006f19248747cde3fbdb636cf40decf1c"

export MSG=$(git log -1 --pretty=%B)
if [[ $MSG != "update to commit $OLD_SHA files" ]]; then
    echo "Bad update sha";
    exit 1;
fi

for file in "achievements.js" "logic.js" "feedback.js"; do
    rm -f ${file}
    wget -O "${file}" "${URL}/${NEW_SHA}/AutoCR/js/${file}"
done

if git status --porcelain | grep -q .; then
    echo "Committing changes"
    git add -A
    git commit -m "update to commit $NEW_SHA files"
else
    echo "No changes found"
fi