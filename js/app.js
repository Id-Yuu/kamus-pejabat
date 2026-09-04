document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const modeSelect = document.getElementById('modeSelect');
    const accordionBtn = document.getElementById('accordionBtn');
    const accordionContent = document.getElementById('accordionContent');
    const accordionIcon = document.getElementById('accordionIcon');

    if (!inputText || !outputText || !modeSelect) {
        console.error('Salah satu elemen DOM tidak ditemukan.');
        return;
    }

    let clickState = { word: '', index: 0 };
    let accordionClickState = { key: '', index: -1 };

    function processTranslation() {
        const isReverse = modeSelect.value === 'id-to-slang';
        const text = inputText.value;
        const translated = TranslatorModule.translate(text, isReverse);
        outputText.value = translated;
    }

    function renderAccordion() {
        if (!accordionContent) return;
        accordionContent.innerHTML = '';

        const isReverse = modeSelect.value === 'id-to-slang';
        const dictionary = DictionaryModule.getMap(isReverse);

        dictionary.forEach((val, key) => {
            const badge = document.createElement('div');
            badge.className = 'dict-badge';
            badge.innerHTML = `<strong>${key}</strong>: ${val}`;

            badge.addEventListener('click', () => {
                const options = val.split(/[,/]/).map(s => s.trim());

                if (accordionClickState.key === key) {
                    accordionClickState.index = (accordionClickState.index + 1) % options.length;
                } else {
                    accordionClickState.key = key;
                    accordionClickState.index = 0;
                }

                const selectedWord = options[accordionClickState.index];

                if (inputText.value.length > 0 && !inputText.value.endsWith(' ')) {
                    const words = inputText.value.trim().split(' ');
                    words[words.length - 1] = selectedWord;
                    inputText.value = words.join(' ') + ' ';
                } else {
                    inputText.value += selectedWord + ' ';
                }

                inputText.focus();
                processTranslation();
            });

            accordionContent.appendChild(badge);
        });
    }

    if (accordionBtn && accordionContent) {
        accordionBtn.addEventListener('click', () => {
            const isOpen = accordionContent.classList.toggle('open');
            accordionIcon.textContent = isOpen ? '▲' : '▼';
        });
    }

    inputText.addEventListener('input', processTranslation);

    modeSelect.addEventListener('change', () => {
        clickState = { word: '', index: 0 };
        accordionClickState = { key: '', index: -1 };
        renderAccordion();
        processTranslation();
    });
    
    inputText.addEventListener('click', () => {
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
    renderAccordion();
});
