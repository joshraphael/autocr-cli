#!/bin/bash

export URL="https://raw.githubusercontent.com/authorblues/retroachievements"
export OLD_SHA="a73ab2cecc9b357d30733eea9f524fea2ac4f1b5"
export NEW_SHA="33769938f9ad3b5dd1afebaaa7d83744803172e9"

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