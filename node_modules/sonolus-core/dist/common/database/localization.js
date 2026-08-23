"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localize = void 0;
const localize = (text, locale, fallbackLocale) => text[locale] ?? text[fallbackLocale] ?? Object.values(text)[0] ?? '';
exports.localize = localize;
