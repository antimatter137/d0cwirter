// i did in fact write this, not ai so shut up
async function startTyping() {
    const textToType = prompt("what sillies do you want to type?");
    if (!textToType) return;

    const speedChoice = prompt("typing speed? (short / medium / long)", "medium").toLowerCase();
    const typoChance = parseFloat(prompt("chance of typo (0–1)?", "0.02"));

    // gotta go fast speed
    const speedPresets = {
        short:  { base: 60, var: 40, sentence: 500, comma: 200, think: [300, 700] },
        medium: { base: 90, var: 60, sentence: 900, comma: 300, think: [500, 1200] },
        long:   { base: 130, var: 80, sentence: 1200, comma: 400, think: [700, 1500] }
    };
    const s = speedPresets[speedChoice] || speedPresets.medium;

    function randomBetween(min, max) { return Math.random() * (max - min) + min; }
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
// pain, I hate google docs
    function findGoogleDocsEditor() {
        for (const frame of document.querySelectorAll("iframe")) {
            try {
                const doc = frame.contentDocument || frame.contentWindow.document;
                const editable = doc.querySelector('[contenteditable="true"]');
                if (editable) return editable;
            } catch {}
        }
        return null;
    }
// hope you look like a human now!
    async function typeLikeHuman(element, text) {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // some typos for fun
            if (Math.random() < typoChance && /[a-zA-Z]/.test(char)) {
                const wrongChar = String.fromCharCode(char.charCodeAt(0) + (Math.random() > 0.5 ? 1 : -1));
                element.dispatchEvent(new InputEvent("beforeinput", {
                    inputType: "insertText", data: wrongChar, bubbles: true, cancelable: true
                }));
                await sleep(s.base + Math.random() * s.var);
                element.dispatchEvent(new InputEvent("beforeinput", {
                    inputType: "deleteContentBackward", bubbles: true, cancelable: true
                }));
                await sleep(s.base + randomBetween(100, 250));
            }

            // type
            element.dispatchEvent(new InputEvent("beforeinput", {
                inputType: "insertText", data: char, bubbles: true, cancelable: true
            }));

            // delays
            let delay = s.base + Math.random() * s.var;
            if (/[.!?]/.test(char)) delay += s.sentence + Math.random() * 150;
            if (/,/.test(char)) delay += s.comma;
            if (char === "\n") delay += 400;
            if (Math.random() < 0.05) delay += randomBetween(...s.think);

            await sleep(delay);
        }
    }

    const editor = findGoogleDocsEditor();
    if (!editor) {
        console.error("could not find the google docs editor. make sure your doc is open and focused and try again but better.");
        return;
    }

    editor.focus();
    console.log("typing started...");
    await typeLikeHuman(editor, textToType);
    console.log("finished typing!!!!!");
}

startTyping();
