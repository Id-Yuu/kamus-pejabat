const TranslatorModule = (function(dict) {
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    function buildRegex(keys) {
        if (!keys.length) return null;
        const sorted = [...keys].sort((a, b) => b.length - a.length);
        const alternatives = sorted.map(key =>
            escapeRegex(key).replace(/\s+/g, '\\s+')
        );
        const pattern = `(?<![\\p{L}\\p{N}_])(${alternatives.join('|')})(?![\\p{L}\\p{N}_])`;
        return new RegExp(pattern, 'giu');
    }

    function matchCase(source, target) {
        if (source === source.toUpperCase() && source !== source.toLowerCase()) {
            return target.toUpperCase();
        }
        if (source[0] === source[0].toUpperCase() && source[0] !== source[0].toLowerCase()) {
            return target[0].toUpperCase() + target.slice(1);
        }
        return target;
    }

    function process(text, isReverse = false) {
        if (!text || !text.trim()) return '';
        
        const keys = dict.getSortedKeys(isReverse);
        const map = dict.getMap(isReverse);
        const regex = buildRegex(keys);
        if (!regex) return text;

        const lookup = new Map();
        for (const [k, v] of map.entries()) {
            lookup.set(k.toLowerCase().replace(/\s+/g, ' '), v);
        }

        return text.replace(regex, (match) => {
            const normalized = match.toLowerCase().replace(/\s+/g, ' ');
            const translation = lookup.get(normalized);
            return translation === undefined ? match : matchCase(match, translation);
        });
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
