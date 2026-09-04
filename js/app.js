document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const modeSelect = document.getElementById('modeSelect');
    
    let clickState = {
        word: '',
        index: 0
    };

    function processTranslation() {
        const isReverse = modeSelect.value === 'id-to-slang';
        const text = inputText.value;
        const translated = TranslatorModule.translate(text, isReverse);
        outputText.value = translated;
    }

    inputText.addEventListener('input', processTranslation);
    modeSelect.addEventListener('change', () => {
        clickState = { word: '', index: 0 };
        processTranslation();
    });

    inputText.addEventListener('click', (e) => {
        const text = inputText.value;
        if (!text.trim()) return;

        const cursorPos = inputText.selectionStart;
        
        const left = text.slice(0, cursorPos).search(/\S+$/);
        const right = text.slice(cursorPos).search(/\s/);
        
        let start = left;
        let end = right === -1 ? text.length : cursorPos + right;
        if (left === -1) start = 0;

        const selectedWord = text.slice(start, end).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        if (!selectedWord) return;

        const isReverse = modeSelect.value === 'id-to-slang';
        const options = TranslatorModule.getWordOptions(selectedWord, isReverse);

        if (options.length > 1) {
            if (clickState.word === selectedWord) {
                clickState.index = (clickState.index + 1) % options.length;
            } else {
                clickState.word = selectedWord;
                clickState.index = 0;
            }

            const replacementWord = options[clickState.index];
            
            const newText = text.slice(0, start) + replacementWord + text.slice(end);
            inputText.value = newText;

            const newCursorPos = start + replacementWord.length;
            inputText.setSelectionRange(newCursorPos, newCursorPos);

            processTranslation();
        }
    });
});