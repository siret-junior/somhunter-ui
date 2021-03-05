import Model, { attr } from "@ember-data/model";

export default class UserContextModel extends Model {
    @attr search;
    @attr history;
    @attr bookmarkedFrames;
    @attr("boolean", { defaultValue: false }) error;
    @attr("string") url;
}
