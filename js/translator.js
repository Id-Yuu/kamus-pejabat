import DICTIONARY from './dictionary.js';

function flattenDictionary(dict) {
  const flat = [];
  Object.values(dict).forEach((items) => {
    items.forEach(({ target, sinonim }) => {
      sinonim.forEach((kata) => flat.push({ kata, target }));
    });
  });
  return flat;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildMatcher(flatList) {
  const sorted = [...flatList].sort((a, b) => b.kata.length - a.kata.length);
  const pattern = sorted.map((item) => escapeRegex(item.kata)).join('|');
  const lookup = Object.fromEntries(sorted.map((item) => [item.kata.toLowerCase(), item.target]));
  return { regex: new RegExp(`\\b(${pattern})\\b`, 'gi'), lookup };
}

const { regex, lookup } = buildMatcher(flattenDictionary(DICTIONARY));

export function translateText(input) {
  if (!input) return '';
  return input.replace(regex, (match) => lookup[match.toLowerCase()] ?? match);
}