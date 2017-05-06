# dotenv-cli

## Installing

```bash
$ npm install -g dotenv-cli
```

## Usage

```bash
$ dotenv <command with arguments>
```

This will load the variables from the .env file in the current working directory and then run the command (using the new set of environment variables)

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

## License

[MIT](https://en.wikipedia.org/wiki/MIT_License)

