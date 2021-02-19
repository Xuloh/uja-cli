const colors = require("ansi-colors");
colors.enabled = require("color-support").hasBasic;

const JishoAPI = require("unofficial-jisho-api");
const jisho = new JishoAPI();

const { hideBin } = require("yargs/helpers");

function japaneseToString(japanese, kanjiKey, kanaKey) {
    if(!japanese[kanjiKey]) {
        return japanese[kanaKey];
    }
    if(!japanese[kanaKey]) {
        return japanese[kanjiKey];
    }
    return `${japanese[kanjiKey]} [${japanese[kanaKey]}]`;
}


function printEntries(entries, enumerate) {
    entries.forEach((entry, idx) => {
        let title;
        if(enumerate) {
            title = colors.bold.cyan(`${idx + 1}. ${entry.title[0]}`);
        } else {
            title = colors.bold.cyan(entry.title[0]);
        }

        console.group(title);

        for(let i = 1; i < entry.title.length; i++) {
            console.log(colors.dim(entry.title[i]));
        }

        entry.body.forEach(body => {
            console.log(`- ${body.main}`);
            if(body.note) {
                console.log("  " + colors.dim(body.note));
            }
        });

        console.groupEnd();
        console.log();
    });
}

function search(argv) {
    jisho.searchForPhrase(argv.query).then(result => {
        if(argv.raw) {
            rawOutput(argv, result);
        } else {
            console.log(result.data.length + " results found");

            if(result.data.length > 0) {
                const entries = result.data.map(item => {
                    return {
                        title: item.japanese.map(jp => japaneseToString(jp, "word", "reading")),
                        body: item.senses.map(sense => {
                            return {
                                main: sense.english_definitions.reduce((acc, cur) => `${acc}; ${cur}`),
                                note: sense.parts_of_speech.reduce((acc, cur) => `${acc}, ${cur}`)
                            };
                        })
                    };
                });

                printEntries(entries, true);
            }
        }
    });
}

function scrape(argv) {
    jisho.scrapeForPhrase(argv.query).then(result => {
        if(argv.raw) {
            rawOutput(argv, result);
        } else {
            console.log(result.found ? "Found" : "Not found");

            if(argv.verbose) {
                console.log(result);
            }

            if(result.found) {
                const entry = {
                    title: [result.query, ...result.otherForms.map(jp => japaneseToString(jp, "kanji", "kana"))],
                    body: result.meanings.map(meaning => {
                        return {
                            main: meaning.definition,
                            note: meaning.tags.reduce((acc, cur) => `${acc}, ${cur}`)
                        };
                    })
                };

                printEntries([entry], false);
            }
        }
    });
}

function kanji(argv) {
    jisho.searchForKanji(argv.query).then(result => {
        if(argv.raw) {
            rawOutput(argv, result);
        } else {
            console.log(result.found ? "Found" : "Not found");

            if(argv.verbose) {
                console.log(result);
            }

            if(result.found) {
                const entry = {
                    title: [
                        `${result.query} [${result.parts.reduce((acc, cur) => `${acc} ${cur}`)}]`,
                        `${result.strokeCount} stroke${result.strokeCount > 1 ? "s" : ""}`
                    ],
                    body: [
                        {
                            main: "Meaning : " + result.meaning
                        },
                        {
                            main: "Kunyomi : " + result.kunyomi.reduce((acc, cur) => `${acc}, ${cur}`)
                        },
                        {
                            main: "Onyomi : " + result.onyomi.reduce((acc, cur) => `${acc}, ${cur}`)
                        }
                    ]
                };

                printEntries([entry], false);
            }
        }
    });
}

function example(argv) {
    jisho.searchForExamples(argv.query).then(result => {
        if(argv.raw) {
            rawOutput(argv, result);
        } else {
            console.log(result.results.length + " results found");

            if(result.results.length > 0) {
                const entries = result.results.map(res => {
                    return {
                        title: [res.kanji, res.kana],
                        body: [
                            {
                                main: res.english
                            }
                        ]
                    };
                });

                printEntries(entries, true);
            }
        }
    });
}

function rawOutput(argv, result) {
    console.log(JSON.stringify(result, null, argv.pretty))
}

const yargs = require("yargs/yargs");
const argv = yargs(hideBin(process.argv))
    .usage("Usage : $0 [options] <command> <query>")
    .epilog(
`
This is an unofficial CLI wrapper for the unofficial Jisho API package.
You can find out more about those projects at ${colors.italic("https://jisho.org/about")} and ${colors.italic("https://github.com/mistval/unofficial-jisho-api#readme")}.
I am ${colors.bold.underline("NOT")} affiliated with any of those projects.
`
    )
    .example("$0 search 勉強")
    .example("$0 search べんきょう")
    .example("$0 search ベンキョウ")
    .example("$0 search benkyou")
    .example("$0 search study")
    .command("search <query>", "search for a word or phrase using the official API",
        yargs => {
            yargs.positional("query", {
                desc: "the word or phrase to search for, can be written in kanji, kana, romaji or in English",
                type: "string"
            });
        },
        search
    )
    .command("scrape <query>", "scrape the page for a word or phrase",
        yargs => {
            yargs.positional("query", {
                desc: "the word or phrase to search for, can be written in kanji, kana, romaji or in English",
                type: "string"
            });
        },
        scrape
    )
    .command("kanji <query>", "scrape for info about a kanji",
        yargs => {
            yargs.positional("query", {
                desc: "the kanji to search for",
                type: "string"
            });
        },
        kanji
    )
    .command("example <query>", "scrape for examples",
        yargs => {
            yargs.positional("query", {
                desc: "example text to search for",
                type: "string"
            });
        },
        example
    )
    .option("r", {
        alias: "raw",
        type: "boolean",
        default: false,
        desc: "enable raw JSON output"
    })
    .option("p", {
        alias: "pretty",
        type: "number",
        default: 0,
        desc: "if raw output is enabled, this value toggles pretty-printing and controls the indent size (a value of 0 disables pretty-printing)",
        implies: "raw",
        requiresArg: true
    })
    .option("v", {
        alias: "verbose",
        type: "boolean",
        default: false,
        desc: "enable verbose output"
    })
    .alias("h", "help")
    .alias("V", "version")
    .strict()
    .showHelpOnFail(false, "Use --help for available options")
    .version("0.1.0")
    .argv;

if(argv.verbose) {
    console.log("argv :", argv);
}
