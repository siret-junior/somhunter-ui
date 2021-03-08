import Model, { attr } from "@ember-data/model";

export default class ReplayWindowModel extends Model {
    @attr show;
    @attr pivotFrameId;
    @attr videoId;
    @attr frames;
}

export function toReplaylWindowModel(pivotId, videoId, data) {
    return {
        data: [
            {
                id: 0,
                type: "replay-window",
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
