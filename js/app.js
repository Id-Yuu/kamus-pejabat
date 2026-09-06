import DICTIONARY from './dictionary.js';

import {
  translateText,
  translateNameToTokens,
  translateByMode
} from './translator.js';

const inputEl = document.getElementById('input-text');
const outputEl = document.getElementById('output-text');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');
const statusEl = document.getElementById('copy-status');
const accordionEl = document.getElementById('accordion');
const modeEl = document.getElementById('translation-mode');
const inputLabelEl = document.getElementById('input-label');
const outputLabelEl = document.getElementById('output-label');

let currentTokens = [];

function renderAccordion() {
  accordionEl.innerHTML = '';

  Object.entries(DICTIONARY).forEach(([kategori, items], idx) => {
    const panelId = `panel-${idx}`;
    const wrapper = document.createElement('div');

    wrapper.className = 'accordion-item';

    const header = document.createElement('button');

    header.type = 'button';
    header.className = 'accordion-header';
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', panelId);
    header.textContent = kategori;

    const panel = document.createElement('div');

    panel.id = panelId;
    panel.className = 'accordion-panel';
    panel.hidden = true;

    items.forEach(({ target, sinonim }) => {
      const badge = document.createElement('span');

      badge.className = 'badge';
      badge.innerHTML = `${sinonim.join(', ')} <strong>&rarr; ${target}</strong>`;

      panel.appendChild(badge);
    });

    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';

      header.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });

    wrapper.append(header, panel);
    accordionEl.appendChild(wrapper);
  });
}

function renderOutput() {
  outputEl.innerHTML = '';

  if (!currentTokens.length) {
    return;
  }

  currentTokens.forEach((token, tokenIndex) => {
    if (token.type === 'text') {
      outputEl.appendChild(document.createTextNode(token.value));
      return;
    }

    if (token.type === 'switchable') {
      const span = document.createElement('span');

      span.className = 'switchable-word';

      if (token.alternatives.length > 1) {
        span.classList.add('has-alternatives');
        span.title = `Double-click untuk mengganti: ${token.alternatives.join(' / ')}`;
      }

      span.textContent = token.alternatives[token.index];
      span.dataset.tokenIndex = String(tokenIndex);

      span.addEventListener('dblclick', (event) => {
        event.preventDefault();
        cycleToken(tokenIndex);
      });

      outputEl.appendChild(span);
    }
  });
}

function cycleToken(tokenIndex) {
  const token = currentTokens[tokenIndex];

  if (!token) {
    return;
  }

  if (token.type !== 'switchable') {
    return;
  }

  if (token.alternatives.length <= 1) {
    return;
  }

  token.index = (token.index + 1) % token.alternatives.length;
  renderOutput();
}

function translateCurrentText() {
  const input = inputEl.value;

  if (!input) {
    currentTokens = [];
    outputEl.innerHTML = '';
    return;
  }

  if (modeEl.value === 'name-to-slang') {
    currentTokens = translateNameToTokens(input);
    renderOutput();
    return;
  }

  const result = translateByMode(input, modeEl.value);

  currentTokens = [
    {
      type: 'text',
      value: result
    }
  ];

  renderOutput();
}

function updateModeUI() {
  if (modeEl.value === 'name-to-slang') {
    inputLabelEl.textContent = 'Nama Pejabat / Teks Asli';
    outputLabelEl.textContent = 'Hasil Kamus Bahasa Gaul';
    inputEl.placeholder = 'Contoh: Prabowo, Gibran, Jokowi...';
  } else {
    inputLabelEl.textContent = 'Teks Asli';
    outputLabelEl.textContent = 'Hasil Terjemahan';
    inputEl.placeholder = 'Contoh: gemoy, kosong, bohong...';
  }

  translateCurrentText();
}

modeEl.addEventListener('change', updateModeUI);
inputEl.addEventListener('input', translateCurrentText);

copyBtn.addEventListener('click', async () => {
  const text = outputEl.textContent;

  if (!text) {
    statusEl.textContent = 'Tidak ada teks untuk disalin.';
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    statusEl.textContent = 'Tersalin ke clipboard!';
  } catch {
    const temp = document.createElement('textarea');

    temp.value = text;
    document.body.appendChild(temp);
    temp.select();

    const ok = document.execCommand('copy');

    temp.remove();

    statusEl.textContent = ok
      ? 'Tersalin (mode fallback).'
      : 'Gagal menyalin, salin manual ya.';
  }

  setTimeout(() => {
    statusEl.textContent = '';
  }, 3000);
});

resetBtn.addEventListener('click', () => {
  inputEl.value = '';
  currentTokens = [];
  outputEl.innerHTML = '';
  statusEl.textContent = '';
  inputEl.focus();
});

renderAccordion();
updateModeUI();
