#!/usr/bin/env node

var spawn = require('cross-spawn')
var path = require('path')
var fs = require('fs')

var argv = require('minimist')(process.argv.slice(2))
var dotenv = require('dotenv')
var envPath = path.resolve(argv.e || '.env')

function fileExists (filePath) {
  try {
    fs.accessSync(filePath)
    return true
  } catch (e) {
    return false
  }
}

if (fileExists(envPath)) {
  dotenv.load({path: envPath})

  if (argv.p) {
    console.log(process.env[argv.p])
    process.exit()
  }
}

spawn(argv._[0], argv._.slice(1), {stdio: 'inherit'})
