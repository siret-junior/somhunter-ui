import Service from '@ember/service';
import { inject as service } from '@ember/service';

import { ELEM_IDS, EVENTS } from '../constants';
import LOG from '../logger';
import utils from '../utils';

export default class DataLoaderService extends Service {
    /* Member methods */
    constructor() {
        super(...arguments);

        // Cached operationId -> endpoint URL records
        this.endpointCache = {};
    }

    /**
     * For the given `operationId` from OpenAPI specification of the core API it
     * returnes the URL of the corresponding endpoint.
     *
     * \param   operationId     A unique `operationId` of the endpoint as defined in OpenAPI specification.
     */
    getEndpoint(operationId) {
        // Check cache
        const record = this.endpointCache[operationId];
        if (typeof record !== 'undefined') {
            return record;
        }

        const apiPaths = this.getConfigApi().paths;

        // For each path defined
        for (const url in apiPaths) {
            const val = apiPaths[url];

            // For each method
            for (const method in val) {
                const valMethod = val[method];

                if (operationId == valMethod.operationId) {
                    this.endpointCache[operationId] = url;
                }
            }
        }

        return this.endpointCache[operationId];
    }


    getConfig() {
        return this.store.peekRecord('config', 0);
    }

    getConfigUi() {
        return this.getConfig().ui;
    }

    getConfigApi() {
        return this.getConfig().api;
    }

    getConfigStrings() {
        return this.getConfig().strings;
    }


    get userContext() {
        return this.store.peekRecord('user-context', 0);
    }

    getLastQuery() {
        const hash = this.store.peekRecord('last-query', 0);
        return hash !== null ? hash.lastQueryHash : '';
    }

    setLastQuery(hash) {
        let lastQuery = this.store.peekRecord('last-query', 0);

        if (!lastQuery) {
            // LOG.D("hash query not there, pushing in: ", hash);
            this.store.push({
                data: [
                    {
                        id: 0,
                        type: 'last-query',
                        attributes: {
                            lastQueryHash: hash,
                        },
                        relationships: {},
                    },
                ],
            });
        } else {
            // LOG.D("Ooverriding prev hash with: ", hash);
            lastQuery = hash;
        }
    }

    getSearchContext() {
        return this.store.peekRecord('user-context', 0)['search'];
    }

    getLikedFrames() {
        return this.getSearchContext().likedFrames;
    }
    toggleLikedFrame(frameId) {
        let liked = this.getSearchContext().likedFrames;

        const idx = liked.findIndex((x) => x.id == frameId);

        // Not found
        if (idx < 0) {
            liked.push({
                id: frameId,
            });
        } else {
            liked.splice(idx, 1);
        }
    }
    pushLikedFrame(frameId) {
        let liked = this.getSearchContext().likedFrames;

        const idx = liked.findIndex((x) => x.id == frameId);

        // Not found
        if (idx < 0) {
            liked.push({
                id: frameId,
            });
        }
    }

    removeLikedFrame(frameId) {
        let liked = this.getSearchContext().likedFrames;

        const idx = liked.findIndex((x) => x.id == frameId);

        // Found
        if (idx >= 0) {
            liked.splice(idx, 1);
        }
    }

    getMainFrames() {
        const data = this.store.peekRecord('main-display', 0);
        return data?.frames;
    }

    getDetailFrames() {
        const detail = this.store.peekRecord('detail-window', 0);
        return detail?.frames;
    }

    getReplayFrames() {
        const detail = this.store.peekRecord('replay-window', 0);
        return detail?.frames;
    }

    getReplayPivotId() {
        const detail = this.store.peekRecord('replay-window', 0);
        return detail?.pivotFrameId;
    }

    getShowDetailView() {
        const detail = this.store.peekRecord('detail-window', 0);
        return detail?.show;
    }

    getShowReplayView() {
        const detail = this.store.peekRecord('replay-window', 0);
        return detail?.show;
    }

    setShowReplayView(val) {
        const window = this.store.peekRecord('replay-window', 0);
        if (window) window.show = val;
    }

    setShowDetailView(val) {
        const window = this.store.peekRecord('detail-window', 0);
        if (window) window.show = val;
    }

    getShowReplaylView() {
        const detail = this.store.peekRecord('replay-window', 0);
        return detail?.show;
    }

    setShowReplayView(val) {
        const window = this.store.peekRecord('replay-window', 0);
        if (window) window.show = val;
    }

    mainDisplayFrames() {
        const mainDisplay = this.store.peekRecord('main-display', 0);

        return mainDisplay?.frames;
    }

    mainDisplayType() {
        const mainDisplay = this.store.peekRecord('main-display', 0);

        return mainDisplay?.activeDisplay;
    }

    setLikedFlag(frameId, likedState) {
        if (likedState) {
            this.pushLikedFrame(frameId);
        } else {
            this.removeLikedFrame(frameId);
        }

        if (!frameId || typeof likedState === 'undefined' || likedState == null)
            throw Error(
                `Invalid params: frameId: ${frameId}, likedState: ${likedState}`);

        // Main grid
        let frames = this.getMainFrames();
        if (frames) {
            frames.forEach((x) => {
                if (x.id == frameId) {
                    x.liked = likedState;
                    LOG.D(
                        `MAIN GRID: Setting liked state to ${frameId} to ${likedState}`);
                }
            });
        }

        // Replay grid
        frames = this.getReplayFrames();
        if (frames) {
            frames.forEach((x) => {
                if (x.id == frameId) {
                    x.liked = likedState;
                    LOG.D(`REPLAY GRID: Setting liked state to ${frameId} to ${likedState}`);
                }
            });
        }

        // Detail grid
        frames = this.getDetailFrames();
        if (frames) {
            frames.forEach((x) => {
                if (x.id == frameId) {
                    x.liked = likedState;
                    LOG.D(`DETAIL GRID: Setting liked state to ${frameId} to ${likedState}`);
                }
            });
        }
    }

    /* Member variables */
    @service store;
}
