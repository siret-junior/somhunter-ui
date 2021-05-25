/** Events that happen in the UI and different
 *  parrts can react to them (via `registerEventHook`).
 *
 * NAME SEMANTICS:
 *      DO_SOMETHING        - Event  asking the system to do 'SOMETHING'.
 *                              -> e.g. on click handler asking to refresh the model
 *      BEFORE_SOMETHING    - Event tirggered just BEFORE starting the processing of 'SOMETHING'.
 *                              -> e.g. ActionManager letting the system know he's about to do 'SOMETHING'
 *      AFTER_SOMETHING    - Event tirggered just AFTER finishing the processing of 'SOMETHING'.
 *                              -> e.g. ActionManager letting the system know he's just finished 'SOMETHING'
 */
export const EVENTS = {
    NAME_VIEW_CHANGE: "viewChange",

    SHOW_DETAIL: "showDetail",
    HIDE_DETAIL: "hideDetail",
    LOAD_DETAIL: "loadDetail",

    SHOW_REPLAY: "showReplay",
    HIDE_REPLAY: "hideReplay",
    LOAD_REPLAY: "loadReplay",
    SLIDE_REPLAY: "slideReplay",

    GLOBAL_ESC_KEY_DOWN: "globalEscKeyDown",
    GLOBAL_ENTER_KEY_DOWN: "globalEnterKeyDown",
    GLOBAL_TAB_KEY_DOWN: "globalTabKeyDown",

    DO_PUSH_NOTIF: "DO_PUSH_NOTIF",
    BLOCK_WITH_NOTIFICATION: "BLOCK_WITH_NOTIFICATION",
    UNBLOCK_WITH_NOTIFICATION: "UNBLOCK_WITH_NOTIFICATION",

    RELOAD_USER_CONTEXT: "reloadUserContext",
    CLEAR_MAIN_GRID: "clearMainGrid",

    SHOW_SETTINGS_WINDOW: "showSettignsWindow",
    SHOW_DEBUG_WINDOW: "showDebugWindow",
    SHOW_HELP_WINDOW: "showHelpWindow",
    SHOW_COLLECTOR_WINDOW: "showCollectorWindow",

    DO_BOOKMARK_FRAME: "DO_BOOKMARK_FRAME",
    BEFORE_BOOKMARK_FRAME: "BEFORE_BOOKMARK_FRAME",
    AFTER_BOOKMARK_FRAME: "AFTER_BOOKMARK_FRAME",

    DO_LIKE_FRAME: "DO_LIKE_FRAME",
    BEFORE_LIKE_FRAME: "BEFORE_LIKE_FRAME",
    AFTER_LIKE_FRAME: "AFTER_LIKE_FRAME",
};

/**
 * Class/ID name strings.
 */
export const ELEM_IDS = {
    MAIN_GRID: "mainGrid",
    DETAIL_WINDOW: "detailWindow",
    DETAIL_WINDOW_SLIDER: "detailWindowSlider",
    REPLAY_WINDOW: "replayWindow",
    REPLAY_WINDOW_SLIDER: "replayWindowSlider",
    CANVAS_QUERY_PREFIX: "canvasQuery_",
};

export const ELEM_CLASSES = {
    ACTIVE_BUTTON: "active",

    GOTO_TOP_SCORED_BTN: "btn-top-scored",
    GOTO_TOP_SCORED_CONTEXT_BTN: "btn-top-scored-context",
    GOTO_SOM_BTN: "btn-som",

    CANVAS_QUERY_PANEL: "query-canvas-panel",
    CANVAS_QUERY_CONT: "canvas-query",
    CANVAS_QUERY_CONT_TEXT: "text",
    CANVAS_QUERY_CONT_BITMAP: "bitmap",
};

export const GUI_STRINGS = {};
