#!/usr/bin/env node

var spawn = require('cross-spawn')
var path = require('path')

var argv = require('minimist')(process.argv.slice(2))
var dotenv = require('dotenv')

dotenv.load({path: path.resolve(argv.e || '.env')})

if (argv.p) {
  console.log(process.env[argv.p])
  process.exit()
}

spawn(argv._[0], argv._.slice(1), {stdio: 'inherit'})
  .on('exit', function (exitCode) {
    process.exit(exitCode)
  })
