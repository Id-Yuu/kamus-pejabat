const TranslatorModule = (function () {
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function translateText(text, reverse = false) {
        if (!text || text.trim() === '') return '';

        const dictionary = DictionaryModule.getMap(reverse);
        let resultText = text;

        DictionaryModule.getSortedKeys(reverse).forEach((key) => {
            const regex = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'gi');
            resultText = resultText.replace(regex, dictionary.get(key));
        });

        return resultText;
    }

    function getWordOptions(word, reverse = false) {
        const value = DictionaryModule.getMap(reverse).get(word.toLowerCase().trim());
        return value ? value.split(',').map((item) => item.trim()) : [word];
    }

    return { translate: translateText, getWordOptions };
})();
