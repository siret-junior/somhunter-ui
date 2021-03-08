import Model, { attr } from "@ember-data/model";

export default class DetailWindowModel extends Model {
    @attr show;
    @attr pivotFrameId;
    @attr videoId;
    @attr frames;
}

export function toDetailWindowModel(pivotId, videoId, data) {
    return {
        data: [
            {
                id: 0,
                type: "detail-window",
                attributes: {
                    show: true,
                    pivotFrameId: Number(pivotId),
                    videoId,
                    frames: data.frames,
                },
                relationships: {},
            },
        ],
    };
}
