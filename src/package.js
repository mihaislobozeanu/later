const later = require("../index");

console.log(JSON.stringify({
  "name": "@eligo-public/later",
  "version": later.version,
  "description": "Determine later (or previous) occurrences of recurring schedules",
  "keywords": ["schedule", "occurrences", "recur", "cron"],
  "author": "BunKat <bill@levelstory.com>",
  "contributors": [
    "mihaislobozeanu <mihaislobozeanu@gmail.com>",
    "Vlad-Dima21 <vladima2001@gmail.com"
  ],
  "repository": {
    "type": "git",
    "url": "git://github.com/mihaislobozeanu/later.git"
  },
  "main": "index.js",
  "browserify": "index-browserify.js",
  "jam": {
    "main": "later.js",
    "shim": {
      "exports": "later"
    }
  },
  "devDependencies": {
    "smash": "~0.0.8",
    "mocha": "*",
    "should": ">=0.6.3",
    "jslint": "*",
    "uglify-js": "*",
    "benchmark": "*"
  },
  "license": "MIT",
  "scripts": {
    "test": "./node_modules/.bin/mocha test/**/*-test.js --reporter dot"
  },
  "publishConfig": {
    "registry": "https://registry.npmjs.org/"
  }
}, null, 2));