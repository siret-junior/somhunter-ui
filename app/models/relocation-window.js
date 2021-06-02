import Model, { attr } from "@ember-data/model";

export default class RelocationWindowModel extends Model {
    @attr show;
    @attr frames;
}

export function toRelocationWindowModel(data) {
    return {
        data: [
            {
                id: 0,
                type: "relocation-window",
                attributes: {
                    show: true,
                    frames: data.frames,
                },
                relationships: {},
            },
        ],
    };
}
