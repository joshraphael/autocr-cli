#!/usr/bin/env node

const { LogicParseError } = require("./logic");
const { AchievementSet, CodeNote, RichPresence } = require("./achievements");
const { assess_code_notes, assess_achievement, assess_leaderboard, assess_rich_presence, assess_set } = require("./feedback");
var fs = require('fs');
var notesFn = null
var userFn = null
var richFn = null
var severity = null

const args = process.argv.slice(2);
if (args.includes('--notes')) {
    const nameIndex = args.indexOf('--notes') + 1;
    notesFn = args[nameIndex];
} else {
    console.log("missing notes file name")
    process.exit(1);
}

if (args.includes('--user')) {
    const nameIndex = args.indexOf('--user') + 1;
    userFn = args[nameIndex];
} else {
    console.log("missing user file name")
    process.exit(1);
}

if (args.includes('--rich')) {
    const nameIndex = args.indexOf('--rich') + 1;
    richFn = args[nameIndex];
} else {
    console.log("missing rich file name")
    process.exit(1);
}

if (args.includes('--severity')) {
    const nameIndex = args.indexOf('--severity') + 1;
    severity = args[nameIndex];
    if( severity !== "error" && severity !== "warn" && severity !== "info" ) {
        console.log("invalid severity level")
        process.exit(1);
    }
    if( severity === "error" ) {
        severity = 3
    }
    if( severity === "warn" ) {
        severity = 2
    }
    if( severity === "info" ) {
        severity = 1
    }
} else {
    console.log("missing severity level")
    process.exit(1);
}

var codeNotes = []
var achievements = new AchievementSet();
var rp = null;

// Load Code Notes
try
{
    let notes = JSON.parse(fs.readFileSync(notesFn, 'utf8'));
    for (const obj of notes) {
        if (obj.Note) {
            codeNotes.push(new CodeNote(obj.Address, obj.Note, obj.User));
        }
    }
}
catch (e)
{
    if (e instanceof LogicParseError) {
        alert(e.message);
    }
    else {
        console.error(e);
    }
    process.exit(1);
}

// Load Achievements
try
{
    achievements.addLocal(fs.readFileSync(userFn, 'utf8'));
}
catch (e)
{
    if (e instanceof LogicParseError) {
        alert(e.message);
    }
    else {
        console.error(e);
    }
    process.exit(1);
}

// Load Rich Presence
try
{
    rp = RichPresence.fromText(fs.readFileSync(richFn, 'utf8'));
}
catch (e)
{
    if (e instanceof LogicParseError) {
        alert(e.message);
    }
    else {
        console.error(e);
    }
    process.exit(1);
}
assess_code_notes(achievements, codeNotes)
for (let ach of achievements.getAchievements()){
    assess_achievement(ach, codeNotes);
}

for (let lb of achievements.getLeaderboards()){
    assess_leaderboard(lb, codeNotes);
}

assess_rich_presence(rp, codeNotes)

assess_set(achievements, codeNotes, rp)

var fail = false
for( var i = 0; i < achievements.getAchievements().length; i++) {
    for( var j = 0; j < achievements.getAchievements()[i].feedback.issues.length; j++ ) {
        for( var k = 0; k < achievements.getAchievements()[i].feedback.issues[j].length; k++ ) {
            let issue = achievements.getAchievements()[i].feedback.issues[j][k]
            if( issue.type.severity == severity ) {
                fail = true
            }
        }
    }
}

if( fail ) {
    process.exit(1);
}