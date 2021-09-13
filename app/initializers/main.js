import Ember from "ember";
import { registerDeprecationHandler } from "@ember/debug";

export function initialize() {
    registerDeprecationHandler((message, options, next) => {
        return;
        // if (options && options.until && options.until !== "2.0.0") {
        //     return;
        // } else {
        //     next(message, options);
        // }
    });
}

export default { initialize };
