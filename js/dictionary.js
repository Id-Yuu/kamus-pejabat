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
        const entries = reverse
            ? officialEntries.map(([official, meanings]) => ({
                id: official,
                label: meanings.join(', '),
                value: official,
                options: meanings
            }))
            : officialEntries.map(([official, meanings]) => ({
                id: official,
                label: official,
                value: meanings.join(', '),
                options: [official]
            }));

        return [{
            title: reverse ? 'Bahasa Indonesia' : 'Nama Pejabat',
            description: reverse
                ? 'Klik lagi kosakata yang sama untuk mengganti variasi setelah tanda koma.'
                : 'Klik nama pejabat untuk menambahkannya ke teks.',
            entries
        }];
    }

    return { getMap, getSortedKeys, getAccordionGroups };
})();
