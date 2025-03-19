"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    error: (message) => `\x1b[31m${message}\x1b[0m`,
    info: (message) => `\x1b[36m${message}\x1b[0m`,
    success: (message) => `\x1b[32m${message}\x1b[0m`,
};
