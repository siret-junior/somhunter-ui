import ENV from "somhunter-ui/config/environment";

const level = ENV.logLevel;

export const D = level >= 4 ? console.debug.bind(console) : () => null;
export const I = level >= 3 ? console.log.bind(console) : () => null;
export const W = level >= 2 ? console.warn.bind(console) : () => null;
export const E = level >= 1 ? console.error.bind(console) : () => null;
