const DictionaryModule = (function () {
    const officialEntries = [
        ['gibran', ['kosong', 'bengong']],
        ['tedy', ['sok sibuk']],
        ['prabowo', ['asbun', 'gemoy']],
        ['jokowi', ['bohong']],
        ['kdm', ['sibuk ngonten']],
        ['anies', ['nganggur', 'baca']],
        ['ganjar', ['lari', 'nonton bkp']],
        ['bj habibie', ['pintar']],
        ['nanik', ['nangis']],
        ['cak imin', ['saya gak tahu']],
        ["ma'ruf amin", ['gak ngapa-ngapain']],
        ['purbaya', ['pusing']],
        ['raffi', ['nyuci']],
        ['uah', ['damai']],
        ['meutya', ['blokir', 'take down']],
        ['bahlil', ['gosong']],
        ['isam', ['serakah']],
        ['febrie', ['emas']],
        ['megawati', ['sok cantik']],
        ['ridwan kamil', ['selingkuh']],
        ['hercules', ['anarkis']],
        ['ahok', ['marah']],
        ['sby', ['santai', 'nyantai']],
        ['yusuf mansur', ['duitnya mana', 'gak ada duit']]
    ];

    const slangToIndonesian = new Map(
        officialEntries.map(([official, meanings]) => [official, meanings.join(', ')])
    );
    const indonesianToSlang = new Map();

    officialEntries.forEach(([official, meanings]) => {
        meanings.forEach((meaning) => indonesianToSlang.set(meaning, official));
    });

    function getMap(reverse = false) {
        return reverse ? indonesianToSlang : slangToIndonesian;
    }

    function getSortedKeys(reverse = false) {
        return Array.from(getMap(reverse).keys()).sort((a, b) => b.length - a.length);
    }

    function getAccordionGroups(reverse = false) {
        const dictionary = getMap(reverse);
        return [{
            title: reverse ? 'Bahasa Indonesia' : 'Nama Pejabat',
            description: reverse
                ? 'Klik kata Bahasa Indonesia untuk menambahkannya ke teks.'
                : 'Klik nama pejabat untuk menambahkannya ke teks.',
            entries: Array.from(dictionary, ([key, value]) => ({ key, value }))
        }];
    }

    return { getMap, getSortedKeys, getAccordionGroups };
})();
