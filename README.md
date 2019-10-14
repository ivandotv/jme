# JME CLI

![CircleCI](https://img.shields.io/circleci/build/github/ivandotv/jme/master)
![Codecov](https://img.shields.io/codecov/c/github/ivandotv/jme)
![NPM](https://img.shields.io/npm/l/jme)

Fully or **partially** merge JSON files on the command line.

## Installation

```bash
npm install jme
```

Usage

```bash
jme file-1.json file-2.json file-3.json > merged.json
```

`file-3.json` will be merged with `file-2.json` and the result will be merged with `file-1.json`
The first file is the target file however, files are never modified, rather the merge result is written to the terminal.

You can pass in any number of files to be merged.

## Partial merging

In addition to fully merging json files, you can merge only some of the
`properties` / `paths` on the JSON object.

Given these files:

```js
// test-1.json
{
  "p1": {
    "id": 1,
    "tags": [1, 2, 3],
    "d1": {
      "p1": "t1",
      "custom1": "t1",
      "dd1": { // override this path with the same path from the other files.
        "pp1": "t1",
        "custom1": "t1"
      }
    }
  }
}


// test-2.json
{
  "p1": {
    "id": 2,
    "tags": [4, 5, 6],
    "d1": {
      "p1": "t2",
      "custom2": "t2",
      "dd1": { //merge only this path
        "pp1": "t2",
        "custom2": "t2"
      }
    }
  }
}
```

You can choose to merge only a part of the file (in this case `p1.d1.dd1`)

```bash
jme test-1.json test-2.json -p 'p1.d1.dd1'
```

result:

```js
{
  "p1": {
    "id": 1,
    "tags": [1, 2, 3],
    "d1": {
      "p1": "t1",
      "custom1": "t1",
      "dd1": {       //only this path 'p1.d1.dd1' is merged
        "pp1": "t2" // comes from test-2.json
        "custom2": "t2",// comes from test-2.json
        "custom1": "t1" // comes from test-1.json
      }
    }
  }
}

```

You can partially merge multiple paths, just make sure to separate then with comma `-p 'p1.d1.dd1,some.other.path,yet.some.other.path'`

If the `path` does not exist in one of the files program will report an error and the merge process will not be executed. However, you can pass an additional flag `-u` or `--allow-undefined` to allow `undefined` paths in the files. In that case, if the `path` does not exist in the file, that file will be skipped for that particular `path`.

### Full path override

You can also override the path on the last file target ( `-o` or `--override`)

In the next example chosen `path` will be merged from `test-3.json` into `test-2.json` and then that same `path` will be **overridden** in `test-1.json` (no merging with the `test-1.json`)

Example:

```bash
jme test-1.json test-2.json test-3.json --path 'p1.d1.dd1' --override
```
