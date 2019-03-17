# dotenv-cli

## Installing

NPM
```bash
$ npm install -g dotenv-cli
```

Yarn
```bash
$ yarn global add dotenv-cli
```

## Usage

```bash
$ dotenv <command with arguments>
```

This will load the variables from the .env file in the current working directory and then run the command (using the new set of environment variables).

### Custom .env files
Another .env file could be specified using the -e flag:
```bash
$ dotenv -e .env2 <command with arguments>
```

Multiple .env files can be specified, and will be processed in order:
```bash
$ dotenv -e .env3 -e .env4 <command with arguments>
```

### Check env variable
If you want to check the value of an environment variable, use the `-p` flag
```bash
$ dotenv -p NODE_ENV
```

### Flags to the underlying command
If you want to pass flags to the inner command use `--` after all the flags to `dotenv-cli`. 

E.g. the following command without dotenv-cli:
```bash
mvn exec:java -Dexec.args="-g -f"
```

will become the following command with dotenv-cli:
```bash
$ dotenv -- mvn exec:java -Dexec.args="-g -f"
``` 
or in case the env file is at `.my-env`
```bash
$ dotenv -e .my-env -- mvn exec:java -Dexec.args="-g -f"
``` 

### Variable expansion
We support expanding env variables inside .env files (See [dotenv-expand](https://github.com/motdotla/dotenv-expand) npm package for more information)

For example:
```
IP=127.0.0.1
PORT=1234
APP_URL=http://${IP}:${PORT}
```
Using the above example `.env` file, `process.env.APP_URL` would be `http://127.0.0.1:1234`.

## License

[MIT](https://en.wikipedia.org/wiki/MIT_License)

