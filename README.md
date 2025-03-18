# Warmachine data

Community projects are nothing without a decent data source, and so this project aims to provide a database of
warmachine data in a friendly JSON format that can be used in any community project. In order for such a project to be
successful, it is important that the broader community is involved in keeping the data up-to-date, through submitting
pull requests.

## How to use this repository

1. First, check out the project using git clone to your local machine
2. Next, make any updates required to the necessary JSON files
3. Run the validation tool to ensure the data provided is valid
4. Commit your changes and open a pull request to this repository

Please note: I do not guarantee that your changes will be merged. If there are issues in the PR, if the update does not
validate using the built-in tools or some other reason, the PR may not be merged and it may even be closed. I reserve
the right to merge pull requests at my own discretion and time availability. This means that PRs may be open for some
time as issues are resolved and/or merged.

## Data and coding standards

Please read the data standards below and familiarise yourself with the formats before submitting any changes. The
built-in validation tools should alert you if a problem is found in your changes, but it is still worthwhile
understanding how the data is structured, formatted and presented.

## Object schemas

The project is dependent upon object schemas enforced by a library called Zod, in order to validate the data. As you
might imagine, invalid data can make the project itself unreliable, and so it is important that the data formatting
standards are upheld. To do this, object schemas are defined in src/schemas.ts and is validated at build time, with the
various data files are then validated against those registered schemas.

Each schema defines the data structures expected within the JSON files.

## Validation

In order to validate any data file, you can call the validator like so:

```console
npm run validate <dataset>
```

Where <dataset> is the name of the data file you wish to validate inside data/ (without the .json suffix). So if we
wanted to validate the data/abilities.json file, we could use the command below:

```console
npm run validate abilities
```

If you want to validate all files, you can call the command "all" or with no arguments:

```console
npm run validate all
npm run validate
```

## Builds

The project builds an appendix.json file which is a reference to any keyword within the dataset. Because all keywords
are unique, you can look up where a particular keyword or record may be found by first checking the built appendix.
json file. Let's say for example we want to know which file the keyword "fieldMarshal" is found. You can include the
appendix.json file, and call the fieldMarshal item on that object:

```typescript
const appendix = import('appendix.json')

console.log(appendix.fieldMarshal) // This will return: abilities, a reference to data/abilities.json
```

The appendix is really just a map of keys where the values represent the files the data is found in.

In order to build the appendix, you can call the following command:

```
npm run build
```

This will then loop over all data files, creating the appropriate references and writing it to build/appendix.json

Note that this file should not be included as part of any commit, but generated as required by your own project.

## JSON files

There are many different JSON files that represent the various units, abilities, spells, weapon qualities.etc.
within the game of Warmachine. Each entry in each of the files may reference one or more other files, due to
keywords, abilities, weapons or spells (considering that many of these entries are not globally unique). This
allows for de-duplication as well as a way to potentially see what units use the same weapon qualities, spells or
anything else.

## Units

data/units.json represents the core of the warmachine unit catalog for Warmachine. Note that Legacy is not currently
included in this dataset, due to how much data is present there. However, should players wish to support Legacy,
this could be managed through community pull requests and the code updated to support the Legacy factions. If there
is enough support, the project has been built in such a way to easily support that requirement, should it be needed.

The units.json file consists of all units within the game (Prime), as well as references to weapons.json, abilities.
json and other files.