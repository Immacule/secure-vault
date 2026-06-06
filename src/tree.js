import { state, toggleFolder, selectFile, setFocus } from './main.js';

// ── ESCAPE HTML ──
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── FILE TYPE ICONS ──
function getIcon(name, type) {
  if (type === 'folder') return '📁';
  const ext = name.split('.').pop().toLowerCase();
  const map = {
    pdf: '📄', png: '🖼', jpg: '🖼', jpeg: '🖼', gif: '🖼', svg: '🖼',
    docx: '📝', doc: '📝', txt: '📃',
    xlsx: '📊', xls: '📊', csv: '📊',
    yaml: '⚙️', yml: '⚙️', json: '⚙️',
    ttf: '🔤', otf: '🔤', woff: '🔤',
    mp4: '🎬', mov: '🎬',
    zip: '🗜', gz: '🗜', tar: '🗜',
    gitignore: '🔧', sh: '💻', js: '💻', ts: '💻', py: '💻',
  };
  return map[ext] || '📄';
}

// ── SEARCH HELPERS ──
function nodeMatchesSearch(node, query) {
  if (!query) return true;
  return node.name.toLowerCase().includes(query);
}

function subtreeMatches(node, query) {
  if (!query) return true;
  if (nodeMatchesSearch(node, query)) return true;
  if (node.children) return node.children.some(c => subtreeMatches(c, query));
  return false;
}

function highlightText(text, query) {
  if (!query) return escHtml(text);
  const idx = text.toLowerCase().indexOf(query);
  if (idx < 0) return escHtml(text);
  return escHtml(text.slice(0, idx))
    + `<mark>${escHtml(text.slice(idx, idx + query.length))}</mark>`
    + escHtml(text.slice(idx + query.length));
}

// ── RECURSIVE RENDER ──
function renderNodes(nodes, container, depth, ancestors) {
  nodes.forEach(node => {
    if (state.searchQuery && !subtreeMatches(node, state.searchQuery)) return;

    const item = document.createElement('div');
    item.className = 'tree-item';
    item.dataset.id = node.id;
    item.setAttribute('role', 'treeitem');
    item.setAttribute('aria-selected', state.selectedId === node.id ? 'true' : 'false');
    item.style.setProperty('--depth', depth);

    if (state.focusedId  === node.id) item.classList.add('focused');
    if (state.selectedId === node.id) item.classList.add('selected');

    const isExpanded = state.expandedIds.has(node.id);
    const isFolder   = node.type === 'folder';

    const toggle = document.createElement('span');
    toggle.className = 'item-toggle' + (isFolder ? (isExpanded ? ' open' : '') : ' leaf');
    toggle.textContent = '▶';

    const icon = document.createElement('span');
    icon.className = 'item-icon';
    icon.textContent = isFolder && isExpanded ? '📂' : getIcon(node.name, node.type);

    const nameEl = document.createElement('span');
    nameEl.className = 'item-name';
    nameEl.innerHTML = highlightText(node.name, state.searchQuery);

    item.appendChild(toggle);
    item.appendChild(icon);
    item.appendChild(nameEl);

    if (node.type === 'file' && node.size) {
      const sizeEl = document.createElement('span');
      sizeEl.className = 'item-size';
      sizeEl.textContent = node.size;
      item.appendChild(sizeEl);
    }

    state.flatList.push({ node, ancestors: [...ancestors] });

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      setFocus(node.id);
      if (isFolder) {
        toggleFolder(node.id);
      } else {
        selectFile(node, ancestors);
      }
    });

    container.appendChild(item);

    if (isFolder && node.children) {
      const childWrap = document.createElement('div');
      childWrap.className = 'tree-children' + (isExpanded ? '' : ' collapsed');
      childWrap.setAttribute('role', 'group');
      renderNodes(node.children, childWrap, depth + 1, [...ancestors, node]);
      container.appendChild(childWrap);
    }
  });
}

// ── PUBLIC ENTRY ──
export function renderTree() {
  state.flatList = [];
  const root = document.getElementById('tree-root');
  root.innerHTML = '';
  renderNodes(state.data, root, 0, []);
}