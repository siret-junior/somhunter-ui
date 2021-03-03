import Model, { attr } from "@ember-data/model";

export default class CoreSettingsModel extends Model {
  @attr generated;
  @attr strings;
  @attr core;
  @attr server;
  @attr ui;
  @attr api;
  @attr("boolean", { defaultValue: false }) error;
  @attr("string") url;
}
