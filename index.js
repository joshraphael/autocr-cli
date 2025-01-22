#!/usr/bin/env node

const { LogicParseError } = require("./logic");
const { AchievementSet, CodeNote, RichPresence } = require("./achievements");
const { assess_code_notes, assess_achievement, assess_leaderboard, assess_rich_presence, assess_set, FeedbackSeverity } = require("./feedback");
var fs = require('fs');
var notesFn = null
var userFn = null
var richFn = null
var severity = null
var report = false

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

if (args.includes('--report')) {
    report = true;
}

if (args.includes('--severity')) {
    const nameIndex = args.indexOf('--severity') + 1;
    severity = args[nameIndex];
    if( severity !== "error" && severity !== "warn" && severity !== "info" ) {
        console.log("invalid severity level")
        process.exit(1);
    }
    if( severity === "error" ) {
        severity = FeedbackSeverity.ERROR
    }
    if( severity === "warn" ) {
        severity = FeedbackSeverity.WARN
    }
    if( severity === "info" ) {
        severity = FeedbackSeverity.INFO
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
    achievements.addLocal(fs.readFileSync(userFn, 'utf8'), codeNotes);
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

function InfoLog(prefix, issue) {
    let body = `${issue.type.desc}`
    if( issue.detail !== null ) {
        body = `${issue.detail} ${issue.type.desc}`
    }
    return `📝 \x1b[34m${prefix}${body}\x1b[0m`
}

function WarnLog(prefix, issue) {
    let body = `${issue.type.desc}`
    if( issue.detail !== null ) {
        body = `${issue.detail} ${issue.type.desc}`
    }
    return `🔔 \x1b[33m${prefix}${body}\x1b[0m`
}

function ErrorLog(prefix, issue) {
    let body = `${issue.type.desc}`
    if( issue.detail !== null ) {
        body = `${issue.detail} ${issue.type.desc}`
    }
    return `🚨 \x1b[31m${prefix}${body}\x1b[0m`
}

var fail = false

var infos = []
var warns = []
var errors = []

infos.push("Code Note Info Details:\n")
warns.push("Code Note Warning Details:\n")
errors.push("Code Note Error Details:\n")
for( var i = 0; i < codeNotes.feedback.issues.length; i++ ) {
    for( var k = 0; k < codeNotes.feedback.issues[i].length; k++ ) {
        let issue = codeNotes.feedback.issues[i][k]
        if( issue.type.severity === FeedbackSeverity.INFO ) {
            infos.push(InfoLog("", issue))
        }
        if( issue.type.severity === FeedbackSeverity.WARN ) {
            warns.push(WarnLog("", issue))
        }
        if( issue.type.severity === FeedbackSeverity.ERROR ) {
            errors.push(ErrorLog("", issue))
        }
        if( issue.type.severity === severity ) {
            fail = true
        }
    }
}

infos.push("Achievement Info Details:\n")
warns.push("Achievement Warning Details:\n")
errors.push("Achievement Error Details:\n")
for( var i = 0; i < achievements.getAchievements().length; i++) {
    for( var j = 0; j < achievements.getAchievements()[i].feedback.issues.length; j++ ) {
        for( var k = 0; k < achievements.getAchievements()[i].feedback.issues[j].length; k++ ) {
            let issue = achievements.getAchievements()[i].feedback.issues[j][k]
            let a = achievements.getAchievements()[i]
            if( issue.type.severity === FeedbackSeverity.INFO ) {
                infos.push(InfoLog(`Achievement '${a.title}' [${a.id}]: `, issue))
            }
            if( issue.type.severity === FeedbackSeverity.WARN ) {
                warns.push(WarnLog(`Achievement '${a.title}' [${a.id}]: `, issue))
            }
            if( issue.type.severity === FeedbackSeverity.ERROR ) {
                errors.push(ErrorLog(`Achievement '${a.title}' [${a.id}]: `, issue))
            }
            if( issue.type.severity === severity ) {
                fail = true
            }
        }
    }
}

infos.push("Leaderboard Info Details:\n")
warns.push("Leaderboard Warning Details:\n")
errors.push("Leaderboard Error Details:\n")
for( var i = 0; i < achievements.getLeaderboards().length; i++) {
    for( var j = 0; j < achievements.getLeaderboards()[i].feedback.issues.length; j++ ) {
        for( var k = 0; k < achievements.getLeaderboards()[i].feedback.issues[j].length; k++ ) {
            let issue = achievements.getLeaderboards()[i].feedback.issues[j][k]
            let lb = achievements.getLeaderboards()[i]
            if( issue.type.severity === FeedbackSeverity.INFO ) {
                infos.push(InfoLog(`Leaderboard '${lb.title}' [${lb.id}]: `, issue))
            }
            if( issue.type.severity === FeedbackSeverity.WARN ) {
                warns.push(WarnLog(`Leaderboard '${lb.title}' [${lb.id}]: `, issue))
            }
            if( issue.type.severity === FeedbackSeverity.ERROR ) {
                errors.push(ErrorLog(`Leaderboard '${lb.title}' [${lb.id}]: `, issue))
            }
            if( issue.type.severity === severity ) {
                fail = true
            }
        }
    }
}

infos.push("Rich Presence Info Details:\n")
warns.push("Rich Presence Warning Details:\n")
errors.push("Rich Presence Error Details:\n")
for( var i = 0; i < rp.feedback.issues.length; i++ ) {
    for( var j = 0; j < rp.feedback.issues[i].length; j++ ) {
        let issue = rp.feedback.issues[i][j]
        if( issue.type.severity === FeedbackSeverity.INFO ) {
            infos.push(InfoLog("", issue))
        }
        if( issue.type.severity === FeedbackSeverity.WARN ) {
            warns.push(WarnLog("", issue))
        }
        if( issue.type.severity === FeedbackSeverity.ERROR ) {
            errors.push(ErrorLog("", issue))
        }
        if( issue.type.severity === severity ) {
            fail = true
        }
    }
}

infos.push("Set Info Details:\n")
warns.push("Set Warning Details:\n")
errors.push("Set Error Details:\n")
for( var i = 0; i < achievements.feedback.issues.length; i++) {
    for( var j = 0; j < achievements.feedback.issues[i].length; j++ ) {
        let issue = achievements.feedback.issues[i][j]
        if( issue.type.severity === FeedbackSeverity.INFO ) {
            infos.push(InfoLog("", issue))
        }
        if( issue.type.severity === FeedbackSeverity.WARN ) {
            warns.push(WarnLog("", issue))
        }
        if( issue.type.severity === FeedbackSeverity.ERROR ) {
            errors.push(ErrorLog("", issue))
        }
        if( issue.type.severity === severity ) {
            fail = true
        }
    }
}

if( report ) {
    for( var i = 0; i < infos.length; i++ ) {
        var msg = infos[i]
        console.log(msg)
    }

    for( var i = 0; i < warns.length; i++ ) {
        var msg = warns[i]
        console.log(msg)
    }

    for( var i = 0; i < errors.length; i++ ) {
        var msg = errors[i]
        console.log(msg)
    }
}

if( fail ) {
    process.exit(1);
}