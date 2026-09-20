#!/bin/bash

export URL="https://raw.githubusercontent.com/RetroAchievements/AutoCR"
export OLD_SHA="7eec326cfaceff8a08161449c0d3d5636a9afc1f"
export NEW_SHA="32ba14360318cdd028bb532b61fc19a537e486d1"

export MSG=$(git log -1 --pretty=%B)
if [[ $MSG != "update to commit $OLD_SHA files" ]]; then
    echo "Bad update sha";
    exit 1;
fi

for file in "achievements.js" "logic.js" "feedback.js"; do
    rm -f ${file}
    curl -L -H "Cache-Control: no-cache" -o "${file}" "${URL}/${NEW_SHA}/js/${file}"
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