document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const modeSelect = document.getElementById('modeSelect');
    const accordionBtn = document.getElementById('accordionBtn');
    const accordionContent = document.getElementById('accordionContent');
    const accordionIcon = document.getElementById('accordionIcon');
    const accordionTitle = document.getElementById('accordionTitle');
    const resetButton = document.getElementById('resetButton');
    const copyButton = document.getElementById('copyButton');
    const copyStatus = document.getElementById('copyStatus');

    if (!inputText || !outputText || !modeSelect) {
        console.error('Salah satu elemen DOM tidak ditemukan.');
        return;
    }

    let clickState = { word: '', index: 0 };

    function isReverseMode() {
        return modeSelect.value === 'id-to-slang';
    }

    function processTranslation() {
        outputText.value = TranslatorModule.translate(inputText.value, isReverseMode());
    }

    function insertSourceWord(word) {
        const selectionStart = inputText.selectionStart;
        const selectionEnd = inputText.selectionEnd;
        const before = inputText.value.slice(0, selectionStart);
        const after = inputText.value.slice(selectionEnd);
        const prefix = before && !/\s$/.test(before) ? ' ' : '';
        const suffix = after && !/^\s/.test(after) ? ' ' : '';

        inputText.value = `${before}${prefix}${word}${suffix}${after}`;
        const cursor = before.length + prefix.length + word.length;
        inputText.focus();
        inputText.setSelectionRange(cursor, cursor);
        processTranslation();
    }

    function renderAccordion() {
        if (!accordionContent) return;

        const reverse = isReverseMode();
        const groups = DictionaryModule.getAccordionGroups(reverse);
        accordionContent.innerHTML = '';
        accordionTitle.textContent = reverse
            ? '📘 Daftar Kosakata Bahasa Indonesia'
            : '👤 Daftar Kosakata Nama Pejabat';

        groups.forEach((group) => {
            const groupElement = document.createElement('section');
            groupElement.className = 'vocabulary-group';
            groupElement.innerHTML = `
                <div class="vocabulary-group-heading">
                    <div>
                        <p class="group-kicker">Kategori</p>
                        <h3>${group.title}</h3>
                        <p>${group.description}</p>
                    </div>
                    <span class="word-count">${group.entries.length} kata</span>
                </div>
            `;

            const badgeList = document.createElement('div');
            badgeList.className = 'badge-list';
            group.entries.forEach(({ key, value }) => {
                const badge = document.createElement('button');
                badge.type = 'button';
                badge.className = 'dict-badge';
                badge.innerHTML = `<strong>${key}</strong><span>${value}</span>`;
                badge.setAttribute('aria-label', `Tambahkan ${key} ke teks`);
                badge.addEventListener('click', () => insertSourceWord(key));
                badgeList.appendChild(badge);
            });

            groupElement.appendChild(badgeList);
            accordionContent.appendChild(groupElement);
        });
    }

    function resetTranslation() {
        inputText.value = '';
        outputText.value = '';
        clickState = { word: '', index: 0 };
        copyStatus.textContent = '';
        inputText.focus();
    }

    async function copyOutput() {
        if (!outputText.value.trim()) {
            copyStatus.textContent = 'Belum ada hasil untuk disalin.';
            return;
        }

        try {
            await navigator.clipboard.writeText(outputText.value);
            copyStatus.textContent = 'Hasil terjemahan disalin!';
        } catch (error) {
            outputText.select();
            document.execCommand('copy');
            copyStatus.textContent = 'Hasil terjemahan disalin!';
        }
    }

    accordionBtn?.addEventListener('click', () => {
        const isOpen = accordionContent.classList.toggle('open');
        accordionBtn.setAttribute('aria-expanded', String(isOpen));
        accordionIcon.textContent = isOpen ? '▲' : '▼';
    });

    inputText.addEventListener('input', () => {
        clickState = { word: '', index: 0 };
        processTranslation();
    });

    modeSelect.addEventListener('change', () => {
        clickState = { word: '', index: 0 };
        copyStatus.textContent = '';
        renderAccordion();
        processTranslation();
    });

    inputText.addEventListener('click', () => {
        const text = inputText.value;
        if (!text.trim()) return;

        const cursorPos = inputText.selectionStart;
        const startMatch = text.slice(0, cursorPos).match(/\S+$/);
        const start = startMatch ? cursorPos - startMatch[0].length : cursorPos;
        const endMatch = text.slice(cursorPos).match(/^\S+/);
        const end = endMatch ? cursorPos + endMatch[0].length : cursorPos;
        const selectedWord = text.slice(start, end).replace(/[^\p{L}\p{N}'-]/gu, '');
        if (!selectedWord) return;

        const options = TranslatorModule.getWordOptions(selectedWord, isReverseMode());
        if (options.length <= 1) return;

        clickState.index = clickState.word === selectedWord
            ? (clickState.index + 1) % options.length
            : 0;
        clickState.word = selectedWord;

        const replacement = options[clickState.index];
        inputText.value = text.slice(0, start) + replacement + text.slice(end);
        inputText.setSelectionRange(start + replacement.length, start + replacement.length);
        processTranslation();
    });

    resetButton?.addEventListener('click', resetTranslation);
    copyButton?.addEventListener('click', copyOutput);
    renderAccordion();
});
