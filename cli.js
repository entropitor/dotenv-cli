#!/usr/bin/env node

var spawn = require('cross-spawn')
var path = require('path')

var argv = require('minimist')(process.argv.slice(2))
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

function print_help() {
  console.log([
    'Usage: dotenv [--help] [-e <path>[ -e <path>...]] [-p <variable name>] [command]',
    '  --help              print help',
    '  -e <path>           add .env file to environment, multiple arguments allowed',
    '  -p <variable name>  print variable value to the console',
    '',
    '  If you do not specify -p, you must specify a command to be run.',
    ''
  ].join('\n'));
}

if (argv.help) {
  print_help();
  process.exit();
}

var paths = ['.env']
if (argv.e) {
  if (typeof argv.e === 'string') {
    paths = [argv.e]
  } else {
    paths = argv.e
  }
}
paths.forEach(function (env) {
  dotenvExpand(dotenv.config({ path: path.resolve(env) }))
})

if (argv.p) {
  console.log(process.env[argv.p])
  process.exit()
}

var command = argv._[0];
if (!command) {
  print_help();
  process.exit(1);
}

spawn(command, argv._.slice(1), { stdio: 'inherit' })
  .on('exit', function (exitCode) {
    process.exit(exitCode)
  })
