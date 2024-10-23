const later = require("../index");

console.log(JSON.stringify({
  "name": "later",
  "version": later.version,
  "description": "Determine later (or previous) occurrences of recurring schedules",
  "keywords": ["schedule", "occurrences", "recur", "cron"],
  "author": "Mihai Slobozeanu <mihai@santinela.com>",
  "repository" : {
    "type" : "git",
    "url" : "git://github.com/mihaislobozeanu/later.git"
  },
  "main": "later.js",
  "license": "MIT"
}, null, 2));