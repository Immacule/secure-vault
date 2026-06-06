// ══════════════════════════════════════════════
//  PROPERTIES PANEL
//  Wildcard Feature: "Copy Full Path"
//  Rationale: Law firms and IT teams frequently
//  need to reference exact file paths in emails,
//  tickets, and audit logs. One-click copy
//  eliminates manual path reconstruction.
// ══════════════════════════════════════════════

function getFileType(name) {
  const ext = name.split('.').pop().toLowerCase();
  const types = {
    pdf: 'PDF Document', png: 'PNG Image', jpg: 'JPEG Image', jpeg: 'JPEG Image',
    gif: 'GIF Image', svg: 'SVG Vector', docx: 'Word Document', doc: 'Word Document',
    txt: 'Plain Text', xlsx: 'Excel Spreadsheet', xls: 'Excel Spreadsheet',
    csv: 'CSV Spreadsheet', yaml: 'YAML Config', yml: 'YAML Config',
    json: 'JSON Data', ttf: 'TrueType Font', otf: 'OpenType Font',
    mp4: 'MP4 Video', zip: 'ZIP Archive', gz: 'GZip Archive',
    gitignore: 'Git Config', sh: 'Shell Script', js: 'JavaScript', ts: 'TypeScript', py: 'Python',
  };
  return types[ext] || ext.toUpperCase() + ' File';
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const icons = {
    pdf: '📄', png: '🖼', jpg: '🖼', jpeg: '🖼', gif: '🖼', svg: '🖼',
    docx: '📝', doc: '📝', txt: '📃', xlsx: '📊', xls: '📊', csv: '📊',
    yaml: '⚙️', yml: '⚙️', json: '⚙️', ttf: '🔤', otf: '🔤',
    mp4: '🎬', zip: '🗜', gz: '🗜', gitignore: '🔧',
    js: '💻', ts: '💻', py: '💻', sh: '💻',
  };
  return icons[ext] || '📄';
}

export function showProperties(node, ancestors) {
  const panel = document.getElementById('props-panel');
  const body  = document.getElementById('props-body');
  panel.classList.add('open');

  const fullPath = [...ancestors.map(a => a.name), node.name].join(' / ');
  const ext = node.name.includes('.') ? node.name.split('.').pop().toLowerCase() : '—';

  body.innerHTML = `
    <div class="file-preview-icon">${getFileIcon(node.name)}</div>

    <div class="props-section">
      <div class="props-section-title">File Info</div>
      <div class="prop-row">
        <span class="prop-key">NAME</span>
        <span class="prop-val">${escHtml(node.name)}</span>
      </div>
      <div class="prop-row">
        <span class="prop-key">TYPE</span>
        <span class="prop-val accent">${getFileType(node.name)}</span>
      </div>
      <div class="prop-row">
        <span class="prop-key">EXTENSION</span>
        <span class="prop-val">.${ext}</span>
      </div>
      <div class="prop-row">
        <span class="prop-key">SIZE</span>
        <span class="prop-val green">${escHtml(node.size || '—')}</span>
      </div>
      <div class="prop-row">
        <span class="prop-key">ID</span>
        <span class="prop-val">${escHtml(node.id)}</span>
      </div>
    </div>

    <div class="props-section">
      <div class="props-section-title">Location</div>
      <div class="prop-row">
        <span class="prop-key">PATH</span>
        <span class="prop-val" style="font-size:11px;line-height:1.6">${escHtml(fullPath)}</span>
      </div>
      <div class="prop-row">
        <span class="prop-key">DEPTH</span>
        <span class="prop-val">${ancestors.length} level${ancestors.length !== 1 ? 's' : ''} deep</span>
      </div>
    </div>

    <button class="copy-path-btn" id="copy-path-btn">
      <span>⎘</span> Copy Full Path
    </button>
  `;

  // Wildcard: Copy Full Path
  document.getElementById('copy-path-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(fullPath).then(() => {
      const btn = document.getElementById('copy-path-btn');
      btn.classList.add('copied');
      btn.innerHTML = '<span>✓</span> Path Copied!';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<span>⎘</span> Copy Full Path';
      }, 2000);
    });
  });
}

export function hideProperties() {
  document.getElementById('props-panel').classList.remove('open');
  document.getElementById('props-body').innerHTML = '';
}

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
