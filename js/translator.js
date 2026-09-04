const TranslatorModule = (function() {

    function translateText(text, reverse = false) {
        if (!text || text.trim() === '') return '';

        const dictionary = DictionaryModule.getMap(reverse);
        const sortedKeys = DictionaryModule.getSortedKeys(reverse);

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        let resultText = text;
        
        const replacements = [];

        sortedKeys.forEach((key, index) => {
            const regex = new RegExp('\\b' + escapeRegExp(key) + '\\b', 'gi');
            if (regex.test(resultText)) {
                const targetValue = dictionary.get(key);
                const placeholder = `___REPL_${index}___`;
                
                replacements.push({
                    placeholder: placeholder,
                    value: targetValue,
                    originalKey: key
                });

                resultText = resultText.replace(regex, placeholder);
            }
        });

        replacements.forEach(item => {
            const placeholderRegex = new RegExp(item.placeholder, 'g');
            resultText = resultText.replace(placeholderRegex, item.value);
        });

        return resultText;
    }

    function getWordOptions(word, reverse = false) {
        const dictionary = DictionaryModule.getMap(reverse);
        const val = dictionary.get(word.toLowerCase().trim());
        if (!val) return [word];
        return val.split(',').map(s => s.trim());
    }

    return {
        translate: translateText,
        getWordOptions: getWordOptions
    };
})();