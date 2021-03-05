export function resetMainGridScroll() {
    const el = document.getElementById("mainGrid");
    if (el) el.scrollTop = 0;
}

/**
 *
 * @param {string} str Original string.
 * @param {int} currIdx Index of the cursor.
 */
export function getCurrSubString(str, currIdx) {
    let i = currIdx - 1;
    for (; i >= 0 && str[i] != " "; --i);
    return str.substr(i + 1, currIdx - (i + 1));
}

/**
 *
 * @param {string} str Original string.
 * @param {int} currIdx Index of the cursor.
 */
export function subCurrWord(str, currIdx, word) {
    let i = currIdx - 1;
    for (; i >= 0 && str[i] != " "; --i);
    const prefix = str.substr(0, i + 1);
    const postfix = str.substr(currIdx);
    return `${prefix}${word}${postfix}`;
}
