#!/usr/bin/env node

var spawn = require('cross-spawn')
var path = require('path')

var argv = require('minimist')(process.argv.slice(2))
var dotenv = require('dotenv')

var paths = ['.env']
if (argv.e) {
  if (typeof argv.e === 'string') {
    paths = [argv.e]
  } else {
    paths = argv.e
  }
}
paths.forEach(function (env) {
  dotenv.load({path: path.resolve(env)})
})

if (argv.p) {
  console.log(process.env[argv.p])
  process.exit()
}

const cmdToRun = argv._[0]
if (!cmdToRun){ // No command given
  process.exit()
}

const cmdIndex = process.argv.indexOf(argv._[0])
const cmdArgs = process.argv.slice(cmdIndex)

spawn(cmdArgs[0], cmdArgs.slice(1), {stdio: 'inherit'})
  .on('exit', function (exitCode) {
    process.exit(exitCode)
  })
