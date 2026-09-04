const TranslatorModule = (function(dict) {
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function process(text, isReverse = false) {
        if (!text || !text.trim()) return '';

        let result = text;
        const keys = dict.getSortedKeys(isReverse);
        const map = dict.getMap(isReverse);

        for (const key of keys) {
            const escaped = escapeRegex(key);
            if (key.includes(' ')) {
                const regex = new RegExp(`(?:^|\\s)(${escaped})(?=\\s|$|[.,!?;:])`, 'gi');
                result = result.replace(regex, (match) => {
                    const prefix = match.startsWith(' ') ? ' ' : '';
                    return prefix + map.get(key);
                });
            } else {
                const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
                result = result.replace(regex, map.get(key));
            }
        }

        return result;
    }

    function countWords(str) {
        if (!str || !str.trim()) return 0;
        return str.trim().split(/\s+/).length;
    }

    return {
        process,
        countWords
    };
})(DictionaryModule);
