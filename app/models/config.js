import Model, { attr } from "@ember-data/model";

export default class ConfigModel extends Model {
    @attr core;
    @attr strings;
    @attr ui;
    @attr dataServer;
    @attr api;
    
    @attr("boolean", { defaultValue: false }) error;
    @attr("string") url;
}
