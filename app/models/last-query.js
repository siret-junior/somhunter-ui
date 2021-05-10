import Model, { attr } from "@ember-data/model";

export default class LastQueryModel extends Model {
    @attr("string") lastQueryHash;
}
