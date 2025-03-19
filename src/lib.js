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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullText = exports.file = exports.index = exports.find = exports.entry = void 0;
/**
 * @module warmachine-data/lib
 * @description This module provides a number of utility functions that can be used to work with the data in the warmachine data repository.
 * @author Kirk Bushell
 */
/**
 * Retrieve a single entry from any of the required data files. The dataset argument should be a reference to a file
 * in the data/ folder, without the .json suffix. Eg. entry('ironLichCommander', 'cryx'). This should only be used
 * when you know exactly where an entry resides.
 */
const entry = async (keyword, dataset) => {
    const data = await (0, exports.file)(`${dataset}.json`);
    return data[keyword];
};
exports.entry = entry;
/**
 * Find an entry that exists in any of the files, by first looking at the index file, and then using the reference to
 * return the actual entry that has been requested.
 */
const find = async (keyword) => {
    const dataset = (await (0, exports.index)())[keyword];
    return (0, exports.entry)(keyword, dataset);
};
exports.find = find;
/**
 * Retrieves the index file's JSON object.
 */
const index = async () => await Promise.resolve().then(() => __importStar(require("../build/index.json")));
exports.index = index;
/**
 * Retrieves a specific file from with the data folder.
 */
const file = async (file) => await Promise.resolve(`${`../data/${file}`}`).then(s => __importStar(require(s)));
exports.file = file;
/**
 * Replaces any placeholder/variables within the provided text with their fulltext versions.
 */
const fullText = (content) => {
    const expression = /\{([a-z]+)(-([a-z0-9]+))*}/ig;
    // @ts-ignore: Ignoring as variadic arguments here is rather important for this logic to work...
    const replacer = async (...args) => {
        args = oddKeys(args);
        // if args[3] is numeric, it's a variable, if it's a string, it's a reference to another ability
        const key = args.shift();
        const name = (await (0, exports.find)(key)).name;
        if (args.length === 0)
            return name;
        return name.replace(/\$([0-9])/, (...matches) => args[matches[1] - 1]);
    };
    return replaceAsync(content, expression, replacer);
};
exports.fullText = fullText;
const replaceAsync = async (content, regexp, replacer) => {
    const replacements = await Promise.all(Array.from(content.matchAll(regexp), (match) => replacer(...match)));
    return content.replace(regexp, () => replacements.shift());
};
/**
 * Parses an array and only returns the elements where the key is an odd value (1, 3.etc.).
 */
const oddKeys = (input) => {
    let values = [];
    for (let i of input.keys()) {
        if (i % 2 === 0)
            continue;
        values.push(input[i]);
    }
    return values.filter(Boolean);
};
