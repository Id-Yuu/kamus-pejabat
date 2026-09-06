import DICTIONARY from './dictionary.js';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function flattenDictionary(dict) {
  const flat = [];
  Object.values(dict).forEach((items) => {
    items.forEach(({ target, sinonim }) => {
      sinonim.forEach((kata) => {
        flat.push({
          kata,
          target
        });
      });
    });
  });
  return flat;
}


function buildMatcher(flatList) {
  const sorted = [...flatList].sort(
    (a, b) => b.kata.length - a.kata.length
  );
  if (!sorted.length) {
    return {
      regex: null,
      lookup: {}
    };
  }
  const pattern = sorted
    .map((item) => escapeRegex(item.kata))
    .join('|');
  const lookup = Object.fromEntries(
    sorted.map((item) => [
      item.kata.toLowerCase(),
      item.target
    ])
  );
  return {
    regex: new RegExp(`\\b(${pattern})\\b`, 'gi'),
    lookup
  };
}

const {
  regex: slangRegex,
  lookup: slangLookup
} = buildMatcher(
  flattenDictionary(DICTIONARY)
);

export function translateText(input) {
  if (!input) return '';
  if (!slangRegex) {
    return input;
  }
  return input.replace(
    slangRegex,
    (match) => slangLookup[match.toLowerCase()] ?? match
  );
}

function flattenNameDictionary(dict) {
  const flat = [];
  Object.values(dict).forEach((items) => {
    items.forEach(({ target, sinonim }) => {
      flat.push({
        nama: target,
        sinonim
      });
    });
  });
  return flat;
}


function buildNameMatcher(flatList) {
  const sorted = [...flatList].sort(
    (a, b) => b.nama.length - a.nama.length
  );
  if (!sorted.length) {
    return {
      regex: null,
      lookup: {}
    };
  }

  const pattern = sorted
    .map((item) => escapeRegex(item.nama))
    .join('|');
  const lookup = Object.fromEntries(
    sorted.map((item) => [
      item.nama.toLowerCase(),
      item.sinonim.join(', ')
    ])
  );
  return {
    regex: new RegExp(`\\b(${pattern})\\b`, 'gi'),
    lookup
  };
}

const {
  regex: nameRegex,
  lookup: nameLookup
} = buildNameMatcher(
  flattenNameDictionary(DICTIONARY)
);

export function translateNameToSlang(input) {
  if (!input) return '';
  if (!nameRegex) {
    return input;
  }
  return input.replace(
    nameRegex,
    (match) => nameLookup[match.toLowerCase()] ?? match
  );
}

export function translateByMode(input, mode) {
  if (!input) return '';
  if (mode === 'name-to-slang') {
    return translateNameToSlang(input);
  }
  return translateText(input);
}
