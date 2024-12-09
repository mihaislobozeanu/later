const later = require("../index");

console.log(JSON.stringify({
  "name": "later",
  "version": later.version,
  "description": "Determine later (or previous) occurrences of recurring schedules",
  "keywords": ["schedule", "occurrences", "recur", "cron"],
  "author": "BunKat <bill@levelstory.com>",
  "author": "BunKat <bill@levelstory.com>",
  "contributors": [
    "mihaislobozeanu <mihaislobozeanu@gmail.com>",
    "Vlad-Dima21 <vladima2001@gmail.com"
  ],
  "repository" : {
    "type" : "git",
    "url" : "git://github.com/mihaislobozeanu/later.git"
  },
  "main": "later.js",
  "license": "MIT"
}, null, 2));