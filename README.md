# Warmachine data

Community projects are nothing without a decent data source, and so this project aims to provide a database of
warmachine data in a friendly JSON format that can be used in any community project. In order for such a project to be
successful, it is important that the broader community is involved in keeping the data up-to-date, by writing
changes and [submitting pull requests](https://github.com/kirkbushell/warmachine-data/pulls).

## How to use this repository

1. First, [fork the project](https://github.com/kirkbushell/warmachine-data/fork) and clone to your local machine
2. Install all required dependencies by running: `npm install`
3. Next, make any updates required to the necessary JSON files.
4. Run the validation tool to ensure the data provided is valid (this will run automatically when you commit, but
   it's a good practise to run this command regularly to ensure you haven't made any simple mistakes with the data
   formats)
5. Commit your changes and open a pull request to this repository.
6. Wait.

*__Please note:__ I reserve the right to review and merge pull requests as timing, quality of the pull request and
communication allows. In order for your pull request to be accepted and merged quickly, please ensure you follow the
[data format standards](#data-format-standards) below, and make sure to use
the [validate command](#validation).*

# Data format standards

Please read the standards below and familiarise yourself with the formats before submitting any changes. The built-in
validation tools should alert you if a problem is found in your changes, but it is still worthwhile understanding how
the data is structured, formatted and presented.

## Core file structure

All JSON files adhere to the following, simple structure:

```json
{
	"identifier": {
		"name": "string",
		...
	}
}
```

This is the core format of all files, with the two key requirements being an identifier as a property, and then an
object representing 1 or more properties, with name being a required field of all entries.

## References

Most entries have one or more references to other entries, rules or hints. In order to ensure these references are
available, the following syntax is required to be used when such keywords are present:

```json
{
	"specialOrders": {
		"name": "Special Orders",
		"rules": "RNG 5. Target friendly Faction warrior model/unit. If the model/unit is in range, it gains {reposition-3} for one turn.",
		"type": "passive"
	}
}
```

Here we see that the ability, "Special Orders" provides the Reposition ability to a target model/unit. A reference
to reposition is provided, and because the number of inches is an argument required by the ability, we use the syntax:
{ability-value} to reference the ability and pass it the required value. If we then look at the Reposition
ability:

```
"At the end of a model/unit with Reposition [$1"]'s activation, it can advance up to $1", then its activation ends."
```

We see that there is a reference to $1 (a variable). $X is used whenever a value that is passed as an argument to a
reference needs to be injected. The X value, refers to the 1st, 2nd, 3rd.etc. variable passed as a reference, so this
allows abilities to have 0 or more variables that it depends on to facilitate the rule.

## Object schemas

The project is dependent upon object schemas enforced by a library called [Zod](https://zod.dev/) for validation. As
you might imagine, invalid data can make the project itself unreliable, and so it is important that the data format
standards are upheld. To do this, object schemas are defined in src/schemas/* and are validated at build time, with each
data file validated against those registered schemas.

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

If you want to validate all files, you can call the command "all" or call it with no arguments:

```console
npm run validate all
npm run validate
```

## Builds

The project builds an index.json file which is a reference to any entry within the dataset. Because all
references must be unique, you can look up where a particular keyword or record may be found by first checking the
built index.json file. Let's say for example we want to know which file the reference "fieldMarshal" is found. You can
import the index.json file, and call the fieldMarshal property on that object:

```typescript
import index from "index.json"

console.log(index.fieldMarshal) // This will return: abilities, a reference to data/abilities.json
```

You can then use this returned value to import the appropriate json file:

```typescript
const record = await import("data/abilities.json")

console.log(record.name) // "Field Marshal"
```

The index is as the name suggests: an index of all entries and where they can be found within the JSON data files.

In order to build the index, you can call the following command:

```
npm run index
```

This will loop over all data files, creating the appropriate references and writing it to build/index.json

Note that this command is run automatically when you commit any changes to the codebase, ensuring the build file is
always up-to-date with any changes made to the referenced JSON files.

# JSON files

There are many different JSON files that represent the various units, abilities, spells, weapon qualities.etc.
within the game of Warmachine. Each entry in each of the files may reference one or more other files, due to
keywords, abilities, weapons or spells (considering that many of these entries are not globally unique). This
allows for de-duplication as well as a way to potentially see what units use the same weapon qualities, spells or
any other data.

## Factions

data/*.json such as cryx.json, khador.json.etc. represents the core of the warmachine unit catalog for Warmachine,
broken up by faction. Note that Legacy is not currently included in this dataset, due to how much data is present there.
However, should players wish to support Legacy, this could be managed through community pull requests and the code
updated to support the Legacy factions. If there is enough support, the project has been built in such a way to easily
support that requirement, should it be needed.

The various json files consists of all units within the game (Prime), as well as references to weapons.json, abilities.
json and other files.

## Keywords

Warmachine makes use of a large number of keywords, both in regards to unit keywords as well as game terms. These
are covered within the keywords.json file.