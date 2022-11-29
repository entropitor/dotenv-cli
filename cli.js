#!/usr/bin/env node

import spawn from 'cross-spawn';
import path from 'path';
import minimist from 'minimist';
import dotenv from 'dotenv';
import { expand } from '@maximumquiet/dotenv-expand';
import createDebug from 'debug';
const debug = createDebug('ldapenv');
import ContextFactory from '@ilb/node_context';

var argv = minimist(process.argv.slice(2));

function printHelp() {
  console.log(
    [
      'Usage: ldapenv [--help] [--debug] [-e <path>] [-v <name>=<value>] [-p <variable name>] [-c [environment]] [-- command]',
      '  --help              print help',
      "  --debug             output the files that would be processed but don't actually parse them or run the `command`",
      '  -e <path>           parses the file <path> as a `.env` file and adds the variables to the environment',
      '  -e <path>           multiple -e flags are allowed',
      '  --webxml <path>     path to web.xml file (default conf/web.xml)',
      '  --context <path>    path to context.xml file (default $HOME/.config/context.xml)',
      '  -v <name>=<value>   put variable <name> into environment using value <value>',
      '  -v <name>=<value>   multiple -v flags are allowed',
      '  -p <variable>       print value of <variable> to the console. If you specify this, you do not have to specify a `command`',
      '  -c [environment]    support cascading env variables from `.env`, `.env.local`, `.env.<environment>`, `.env.<environment>.local` files',
      '  command             `command` is the actual command you want to run. Best practice is to precede this command with ` -- `. Everything after `--` is considered to be your command. So any flags will not be parsed by this tool but be passed to your command. If you do not do it, this tool will strip those flags'
    ].join('\n')
  );
}

if (argv.help) {
  printHelp();
  process.exit();
}

var paths = [];
if (argv.e) {
  if (typeof argv.e === 'string') {
    paths.push(argv.e);
  } else {
    paths.push(...argv.e);
  }
} else {
  paths.push('.env');
}

if (argv.c) {
  paths = paths.reduce(
    (accumulator, path) =>
      accumulator.concat(
        typeof argv.c === 'string'
          ? [`${path}.${argv.c}.local`, `${path}.${argv.c}`, `${path}.local`, path]
          : [`${path}.local`, path]
      ),
    []
  );
}

function validateCmdVariable(param) {
  if (!param.match(/^\w+=\w+$/)) {
    console.error('Unexpected argument ' + param + '. Expected variable in format variable=value');
    process.exit(1);
  }

  return param;
}
var variables = [];
if (argv.v) {
  if (typeof argv.v === 'string') {
    variables.push(validateCmdVariable(argv.v));
  } else {
    variables.push(...argv.v.map(validateCmdVariable));
  }
}
var parsedVariables = dotenv.parse(Buffer.from(variables.join('\n')));

if (argv.debug) {
  console.log(paths);
  console.log(parsedVariables);
  process.exit();
}

paths.forEach(function (env) {
  expand(dotenv.config({ path: path.resolve(env) }));
});
Object.assign(process.env, parsedVariables);

if (argv.p) {
  var value = process.env[argv.p];
  console.log(value != null ? value : '');
  process.exit();
}

var command = argv._[0];
if (!command) {
  printHelp();
  process.exit(1);
}
const contextConfig = {
  webXmlPath: argv.webxml,
  contextXmlPath: argv.context
};
debug('contextConfig = %o', contextConfig);
const contextFactory = new ContextFactory(contextConfig);
await contextFactory.build();

spawn(command, argv._.slice(1), { stdio: 'inherit' }).on('exit', function (exitCode, signal) {
  if (typeof exitCode === 'number') {
    process.exit(exitCode);
  } else {
    process.kill(process.pid, signal);
  }
});
