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

## Types

The project is dependent upon Typescript types in order to validate the data. As you might imagine, invalid data can
make the project itself unreliable, and so it is important that the data formatting standards are upheld. To do this,
many types are registered in types.d.ts, a global types file that is automatically included at build time, and the
JSON files are then validated against those registered types.

Each type defines the data structure expected within the JSON files.

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