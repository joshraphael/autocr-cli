#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export OLD_SHA="a9cc2c904ea50525ff1cc6e4cdb1369fd82c6b91"
export NEW_SHA="7eec326cfaceff8a08161449c0d3d5636a9afc1f"

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
    git status
    git add -A
    git status
    git commit -m "update to commit $NEW_SHA files"
else
    echo "No changes found"
fi