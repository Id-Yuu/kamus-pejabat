import DICTIONARY from './dictionary.js';
import { translateByMode } from './translator.js';

const inputEl = document.getElementById('input-text');
const outputEl = document.getElementById('output-text');
const copyBtn = document.getElementById('copy-btn');
const resetBtn = document.getElementById('reset-btn');
const statusEl = document.getElementById('copy-status');
const accordionEl = document.getElementById('accordion');
const modeEl = document.getElementById('translation-mode');
const inputLabelEl = document.getElementById('input-label');
const outputLabelEl = document.getElementById('output-label');


function renderAccordion() {
  accordionEl.innerHTML = '';
  Object.entries(DICTIONARY).forEach(
    ([kategori, items], idx) => {
      const panelId = `panel-${idx}`;
      const wrapper = document.createElement('div');
      wrapper.className = 'accordion-item';
      
      const header = document.createElement('button');
      header.type = 'button';
      header.className = 'accordion-header';
      header.setAttribute(
        'aria-expanded',
        'false'
      );
      header.setAttribute(
        'aria-controls',
        panelId
      );
      header.textContent = kategori;

      const panel = document.createElement('div');
      panel.id = panelId;
      panel.className = 'accordion-panel';
      panel.hidden = true;

      items.forEach(
        ({ target, sinonim }) => {
          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.innerHTML =
            `${sinonim.join(', ')}
             <strong>&rarr; ${target}</strong>`;

          panel.appendChild(badge);
        }
      );


      header.addEventListener(
        'click',
        () => {
          const expanded =
            header.getAttribute(
              'aria-expanded'
            ) === 'true';
          header.setAttribute(
            'aria-expanded',
            String(!expanded)
          );
          panel.hidden = expanded;
        }
      );
      wrapper.append(
        header,
        panel
      );

      accordionEl.appendChild(wrapper);
    }
  );
}



function updateModeUI() {
  if (modeEl.value === 'name-to-slang') {
    inputLabelEl.textContent =
      'Nama Pejabat / Teks Asli';
    outputLabelEl.textContent =
      'Hasil Kamus Bahasa Gaul';
    inputEl.placeholder =
      'Contoh: Prabowo, Gibran, Jokowi...';
  } else {
    inputLabelEl.textContent =
      'Teks Asli';
    outputLabelEl.textContent =
      'Hasil Terjemahan';
    inputEl.placeholder =
      'Contoh: gemoy, kosong, bohong...';
  }
  translateCurrentText();
}

function translateCurrentText() {
  outputEl.value = translateByMode(
    inputEl.value,
    modeEl.value
  );
}

inputEl.addEventListener(
  'input',
  translateCurrentText
);

modeEl.addEventListener(
  'change',
  updateModeUI
);


resetBtn.addEventListener(
  'click',
  () => {
    inputEl.value = '';
    outputEl.value = '';
    statusEl.textContent = '';
    inputEl.focus();
  }
);

copyBtn.addEventListener(
  'click',
  async () => {
    const text = outputEl.value;
    if (!text) {
      statusEl.textContent =
        'Tidak ada teks untuk disalin.';
      return;
    }


    try {
      await navigator.clipboard.writeText(text);
      statusEl.textContent =
        'Tersalin ke clipboard!';
    } catch {
      outputEl.select();
      outputEl.setSelectionRange(
        0,
        text.length
      );
      const ok =
        document.execCommand('copy');
      statusEl.textContent =
        ok
          ? 'Tersalin (mode fallback).'
          : 'Gagal menyalin, salin manual ya.';
    }
    setTimeout(
      () => {
        statusEl.textContent = '';
      },
      3000
    );
  }
);

renderAccordion();
updateModeUI();
