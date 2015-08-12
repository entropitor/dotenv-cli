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

## License

[MIT](https://en.wikipedia.org/wiki/MIT_License)

