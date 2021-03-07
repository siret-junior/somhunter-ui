import Application from "@ember/application";
import Resolver from "ember-resolver";
import loadInitializers from "ember-load-initializers";
import config from "somhunter-ui/config/environment";

import { action } from "@ember/object";
import { inject as service } from "@ember/service";

import CS from "./constants";

export default class App extends Application {
    modulePrefix = config.modulePrefix;
    podModulePrefix = config.podModulePrefix;
    Resolver = Resolver;

    /* Member variables */
    @service actionManager;
}

loadInitializers(App, config.modulePrefix);
