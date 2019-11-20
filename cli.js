#!/usr/bin/env node

var spawn = require('cross-spawn')
var path = require('path')

var argv = require('minimist')(process.argv.slice(2))
var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

function printHelp () {
  console.log([
    'Usage: dotenv [--help] [-e <path>] [-p <variable name>] [-- command]',
    '  --help              print help',
    '  -e <path>           parses the file <path> as a `.env` file and adds the variables to the environment',
    '  -e <path>           multiple -e flags are allowed',
    '  -p <variable>       print value of <variable> to the console. If you specify this, you do not have to specify a `command`',
    '  command             `command` is the actual command you want to run. Best practice is to precede this command with ` -- `. Everything after `--` is considered to be your command. So any flags will not be parsed by this tool but be passed to your command. If you do not do it, this tool will strip those flags'
  ].join('\n'))
}

if (argv.help) {
  printHelp()
  process.exit()
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
  var value = process.env[argv.p]
  console.log(value != null ? value : '')
  process.exit()
}

var command = argv._[0]
if (!command) {
  printHelp()
  process.exit(1)
}

spawn(command, argv._.slice(1), { stdio: 'inherit' })
  .on('exit', function (exitCode) {
    process.exit(exitCode)
  })
