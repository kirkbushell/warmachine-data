"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.validate = void 0;
const output_1 = __importDefault(require("./output"));
const fs = __importStar(require("node:fs"));
const Ability_1 = __importDefault(require("./schemas/Ability"));
const Advantage_1 = __importDefault(require("./schemas/Advantage"));
const Spell_1 = __importDefault(require("./schemas/Spell"));
const primitives_1 = require("./schemas/primitives");
const Keyword_1 = __importDefault(require("./schemas/Keyword"));
const units_1 = require("./schemas/units");
const CommandCard_1 = __importDefault(require("./schemas/CommandCard"));
const schemas = {
    "abilities": Ability_1.default,
    "advantages": Advantage_1.default,
    "command-cards": CommandCard_1.default,
    "keywords": Keyword_1.default,
    "spells": Spell_1.default,
    "cryx": units_1.BaseUnit,
};
/**
 * Validate the existing data files, following the expected schema formats.
 */
const validate = (program) => async (dataset) => {
    try {
        // If the default argument is provided, validate all schemas, else validate only the required one.
        const datasets = dataset === 'all' ? Object.keys(schemas) : [dataset];
        // Loop through all required schemas, and validate in turn.
        for (const schema of datasets) {
            process.stdout.write(output_1.default.info(`Validating data/${schema}.json... `));
            const module = await Promise.resolve(`${`../data/${schema}.json`}`).then(s => __importStar(require(s)));
            // First we ensure that the file's structure matches the required format.
            primitives_1.Dataset.parse(module.default);
            // Then we loop through each record and validate against the appropriate schema
            for (const record of Object.values(module.default)) {
                const result = parse(schema, record);
                if (!result.success) {
                    // @ts-ignore
                    throw new Error(`Invalid schema for ${record.name}: ${result.error.message}`);
                }
            }
            console.log(output_1.default.success(`Done.`));
        }
    }
    catch (exception) {
        program.error(exception);
    }
};
exports.validate = validate;
/**
 * Builds the appendix.json file. To do this, it loops through all data files, pulls out the key and then creates a map of key -> data file. This allows
 * fast lookups of required records in the data files, and will error if non-unique values are found.
 */
const build = (program) => async () => {
    // First we validate - no point in building if the data files are incorrect
    await (0, exports.validate)(program)('all');
    process.stdout.write(output_1.default.info("Building index.json... "));
    let map = {};
    for (const schema of Object.keys(schemas)) {
        const module = await Promise.resolve(`${`../data/${schema}.json`}`).then(s => __importStar(require(s)));
        for (const key of Object.keys(module.default)) {
            if (map[key]) {
                program.error(`Duplicate discovered for key ${key} in schema data/${schema}.json. Original key found in data/${map[key]}.json`);
            }
            map[key] = schema;
        }
    }
    const appendix = JSON.stringify(Object.keys(map).sort().reduce((obj, key) => {
        obj[key] = map[key];
        return obj;
    }, {}), null, 4);
    const buildDirectory = process.cwd() + '/build';
    if (!fs.existsSync(buildDirectory)) {
        fs.mkdirSync(buildDirectory);
    }
    fs.writeFileSync(`${buildDirectory}/index.json`, appendix);
    console.log(output_1.default.success('Done.'));
};
exports.build = build;
/**
 * Our parse requirements get complex quick. If the base schema is a Unit, then first we want to work out what kind of unit it is. If we
 * can determine a unit, then we'll use the returned Schema object, else we'll defer to Unit.
 */
const parse = (schema, record) => {
    const parser = schemas[schema] === units_1.BaseUnit ? (0, units_1.unitSchema)(record) : schemas[schema];
    return parser.safeParse(record);
};
