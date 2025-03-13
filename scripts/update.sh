#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export OLD_SHA="1520297e9dec7644272a426ec8a2f6723b4883ef"
export NEW_SHA="95c2819c408f47d962bb5f43598ec7ad462219a7"

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