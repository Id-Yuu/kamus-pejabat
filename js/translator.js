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
        sinonim: [...sinonim]
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
      item.sinonim
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

export function translateNameToTokens(input) {
  if (!input) return [];
  if (!nameRegex) {
    return [
      {
        type: 'text',
        value: input
      }
    ];
  }

  const tokens = [];
  let lastIndex = 0;

  input.replace(
    nameRegex,
    (match, _group, offset) => {
      if (offset > lastIndex) {
        tokens.push({
          type: 'text',
          value: input.slice(lastIndex, offset)
        });
      }

      const alternatives =
        nameLookup[match.toLowerCase()] ?? [];
      if (alternatives.length) {
        tokens.push({
          type: 'switchable',
          original: match,
          alternatives,
          index: 0
        });
      } else {
        tokens.push({
          type: 'text',
          value: match
        });
      }
      lastIndex = offset + match.length;
      return match;
    }
  );
  if (lastIndex < input.length) {
    tokens.push({
      type: 'text',
      value: input.slice(lastIndex)
    });
  }
  return tokens;
}

export function translateNameToSlang(input) {
  const tokens = translateNameToTokens(input);

  return tokens
    .map((token) => {
      if (token.type === 'switchable') {
        return token.alternatives[token.index];
      }
      return token.value;
    })
    .join('');
}

export function translateByMode(input, mode) {
  if (!input) return '';
  if (mode === 'name-to-slang') {
    return translateNameToSlang(input);
  }
  return translateText(input);
}
