# autocr-cli

Heavily taken from [AutoCR](https://github.com/authorblues/retroachievements/tree/main/AutoCR) in an attempt to use the same logic as in a command line interface to automate checking achievement logic in pipelines

## Usage

```sh
$ node index.js --notes <notes-json> --user <user-text> --rich <rich-text> [<options>]
```

|Title|Option|Parameters|Description|
|-|-|-|-|
|Generate Report|`--report`|None|Print out report of all INFO, WARN, and ERROR messages for each category: Code Notes, Achievements, Leaderboards, Rich Presence, and Set|
|Failure Severity|`--severity`|`(info\|warn\|error)`|Returns an exit code of 1 if an issue at the level of severity specified or higher is reported from AutoCR|