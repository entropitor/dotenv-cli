# dotenv-cli

## Installing

```bash
$ npm install -g dotenv-cli
```

## Usage

```bash
$ dotenv <command with arguments>
```

This will load the variables from the .env file in the current working directory and then run the command (using the new set of environment variables).

Another .env file could be specified using the -e flag:
```bash
$ dotenv -e .env2 <command with arguments>
```

Multiple .env files can be specified, and will be processed in order:
```bash
$ dotenv -e .env3 -e .env4 <command with arguments>
```

If you want to check the value of an environment variable, use the `-p` argument
```bash
$ dotenv -p NODE_ENV
```

If you want to pass parameters to the command use `--`. E.g. `mvn exec:java -Dexec.args="-g -f"` would become (see https://github.com/entropitor/dotenv-cli/issues/8):

```bash
$ dotenv mvn exec:java -- -Dexec.args="-g -f"
``` 

## License

[MIT](https://en.wikipedia.org/wiki/MIT_License)

