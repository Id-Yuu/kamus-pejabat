const UIController = (function(translator, dict) {
    let isReverseMode = false;

    const elements = {
        inputText: document.getElementById('inputText'),
        outputContent: document.getElementById('outputContent'),
        translateBtn: document.getElementById('translateBtn'),
        swapBtn: document.getElementById('swapBtn'),
        clearBtn: document.getElementById('clearBtn'),
        copyBtn: document.getElementById('copyBtn'),
        inputWordCount: document.getElementById('inputWordCount'),
        outputWordCount: document.getElementById('outputWordCount'),
        accordionToggle: document.getElementById('accordionToggle'),
        accordionContent: document.getElementById('accordionContent'),
        dictTotalCount: document.getElementById('dictTotalCount'),
        dictSearch: document.getElementById('dictSearch'),
        dictGrid: document.getElementById('dictGrid'),
        toast: document.getElementById('toast'),
        modeTag: document.getElementById('modeTag'),
        subheadText: document.getElementById('subheadText'),
        outputTitle: document.getElementById('outputTitle'),
        modeFooter: document.getElementById('modeFooter')
    };

    function showToast(message) {
        elements.toast.textContent = message;
        elements.toast.classList.add('show');
        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 2000);
    }

    function updateCounts(inputText, outputText) {
        elements.inputWordCount.textContent = `${translator.countWords(inputText)} kata`;
        elements.outputWordCount.textContent = `${translator.countWords(outputText)} kata`;
    }

    function executeTranslation() {
        const text = elements.inputText.value;
        const result = translator.process(text, isReverseMode);
        elements.outputContent.textContent = result;
        updateCounts(text, result);
    }

    function toggleReverseMode() {
        isReverseMode = !isReverseMode;

        if (isReverseMode) {
            elements.modeTag.textContent = 'ID ➔ Kamus';
            elements.subheadText.textContent = '✍️ Mode Dibalik: Masukkan kata Bahasa Indonesia untuk diubah ke kamus pejabat.';
            elements.outputTitle.textContent = '📄 Hasil Terjemahan (Kamus pejabat)';
            elements.modeFooter.textContent = 'Mode: Bahasa Indonesia ➔ Kamus';
            elements.swapBtn.style.background = '#38bdf8';
            elements.swapBtn.style.borderColor = '#38bdf8';
        } else {
            elements.modeTag.textContent = 'Kamus ➔ ID';
            elements.subheadText.textContent = '✍️ Mode Normal: Masukkan kamus pejabat untuk diterjemahkan ke Bahasa Indonesia.';
            elements.outputTitle.textContent = '📄 Hasil Terjemahan (Bahasa Indonesia)';
            elements.modeFooter.textContent = 'Mode: Kamus ➔ Bahasa Indonesia';
            elements.swapBtn.style.background = 'var(--accent-orange)';
            elements.swapBtn.style.borderColor = 'var(--accent-orange)';
        }

        executeTranslation();
        showToast(`Mode: ${isReverseMode ? 'ID ➔ Kamus' : 'Kamus ➔ ID'}`);
    }

    function clearInput() {
        elements.inputText.value = '';
        elements.outputContent.textContent = '';
        updateCounts('', '');
        elements.inputText.focus();
    }

    function copyOutput() {
        const text = elements.outputContent.textContent;
        if (!text.trim()) {
            showToast('Belum ada hasil terjemahan');
            return;
        }

        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        try {
            document.execCommand('copy');
            showToast('Terjemahan disalin!');
        } catch (err) {
            showToast('Gagal menyalin');
        }
        document.body.removeChild(tempTextArea);
    }

    function appendWordToInput(word) {
        const currentVal = elements.inputText.value;
        if (!currentVal.trim()) {
            elements.inputText.value = word;
        } else {
            const needsSpace = !currentVal.endsWith(' ');
            elements.inputText.value = currentVal + (needsSpace ? ' ' : '') + word;
        }
        
        executeTranslation();
        elements.inputText.focus();
        elements.inputText.setSelectionRange(elements.inputText.value.length, elements.inputText.value.length);
        showToast(`"${word}" ditambahkan`);
    }

    function renderDictionary(filter = '') {
        const map = dict.getMap(false);
        elements.dictGrid.innerHTML = '';
        let count = 0;

        map.forEach((val, key) => {
            if (!filter || key.includes(filter.toLowerCase()) || val.includes(filter.toLowerCase())) {
                count++;
                const item = document.createElement('div');
                item.className = 'dict-item';
                item.innerHTML = `<span class="dict-key">${key}</span><span class="dict-val">${val}</span>`;
                
                item.addEventListener('click', () => {
                    const targetWord = isReverseMode ? val.split(',')[0].trim() : key;
                    appendWordToInput(targetWord);
                });

                elements.dictGrid.appendChild(item);
            }
        });

                elements.dictTotalCount.textContent = count;
            }

            function toggleAccordion() {
                elements.accordionToggle.classList.toggle('active');
                if (elements.accordionContent.style.maxHeight) {
                    elements.accordionContent.style.maxHeight = null;
                } else {
                    elements.accordionContent.style.maxHeight = elements.accordionContent.scrollHeight + "px";
                }
            }

            function bindEvents() {
                elements.translateBtn.addEventListener('click', executeTranslation);
                elements.swapBtn.addEventListener('click', toggleReverseMode);
                elements.clearBtn.addEventListener('click', clearInput);
                elements.copyBtn.addEventListener('click', copyOutput);

                elements.inputText.addEventListener('input', () => {
                    const val = elements.inputText.value;
                    elements.inputWordCount.textContent = `${translator.countWords(val)} kata`;
                    if (!val.trim()) {
                        elements.outputContent.textContent = '';
                        elements.outputWordCount.textContent = '0 kata';
                    }
                });

                elements.inputText.addEventListener('keydown', (e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        e.preventDefault();
                        executeTranslation();
                    }
                });

                elements.accordionToggle.addEventListener('click', toggleAccordion);

                elements.dictSearch.addEventListener('input', (e) => {
                    renderDictionary(e.target.value);
                    if (elements.accordionToggle.classList.contains('active')) {
                        elements.accordionContent.style.maxHeight = elements.accordionContent.scrollHeight + "px";
                    }
                });
            }

            function init() {
                bindEvents();
                renderDictionary();
                executeTranslation();
            }

            return { init };
        })(TranslatorModule, DictionaryModule);

        window.addEventListener('DOMContentLoaded', () => {
            UIController.init();
        });
