# Unofficial Jisho API CLI Wrapper

This is an unofficial CLI wrapper for the [unofficial Jisho API package](https://github.com/mistval/unofficial-jisho-api).
You can find out more about those projects at https://jisho.org/about and https://github.com/mistval/unofficial-jisho-api#readme.
I am **NOT** affiliated with any of those projects.

## Usage

- Basic usage :
```bash
uja [options] <command> <query>`
```

- Commands :

Command | Description
--- | ---
`search` | search for a word or phrase using the official API
`scrape` | scrape the page for a word or phrase
`kanji` | scrape for info about a kanji
`example` | scrape for examples

- Options :

Short | Long | Description
--- | --- | ---
`-r` | `--raw` | enable raw JSON output (primarily intended for use with other programs, so that they can use this script to easily query Jisho)
`-p` | `--pretty` | if raw output is enabled, this value toggles pretty-printing and controls the indent size (a value of 0 disables pretty-printing)
`-v` | `--verbose` | enable verbose output
`-h` | `--help` | display the help message
`-V` | `--version` | display the version

- Examples :
    - `uja search 勉強`
    - `uja search べんきょう`
    - `uja search ベンキョウ`
    - `uja search benkyou`
    - `uja search study`

## Build

Before proceeding, don't forget to check that both [Node.js](https://nodejs.org/en/) and npm are installed and then run :
```bash
npm install
```

### Standalone script

To build a standalone version of the script just run :
```bash
npm run build
```

This will package the script and its dependencies in a bundle called `uja` under the `build` directory that you can then run with :
```bash
node build/uja
```
or :
```bash
./build/uja
```

### Standalone executable

You still need to install [Node.js](https://nodejs.org/en/) to run the script, so if that's something you'd rather not do, you can build a standalone executable by running :
```bash
npm run build-exe
```
Please note that the resulting executable will be rather large (71 MB on my computer as of writing this) since its basically bundling the Node.js runtime and the script together in the same file.

## About

This program just passes input to and displays results from the [unofficial Jisho API](https://github.com/mistval/unofficial-jisho-api).
You should probably read their documentation to make better use of this program.
If you encounter a problem, you should consider whether it might come from this program or the unofficial Jisho API before posting an issue.

This program is primarily intended for my personal use with other programs, hence the `--raw` option.
The "human-friendly" output was made quickly and is not as comprehensive as it could be, but since I won't be using it, it might not see a lot of updates. Feel free to contribute if you want to improve it 😁.
