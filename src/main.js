import { renderTree } from './tree.js';
import { showProperties } from './properties.js';

export const state = {
  data: [],
  selectedId: null,
  focusedId: null,
  expandedIds: new Set(),
  searchQuery: '',
  flatList: [],
};

export function toggleFolder(id) {
  if (state.expandedIds.has(id)) {
    state.expandedIds.delete(id);
  } else {
    state.expandedIds.add(id);
  }
  rerender();
}

export function selectFile(node, ancestors) {
  state.selectedId = node.id;
  state.focusedId  = node.id;
  showProperties(node, ancestors);
  updateBreadcrumb(ancestors, node);
  document.getElementById('welcome').style.display = 'none';
  rerender();
}

export function setFocus(id) {
  state.focusedId = id;
  rerender();
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) el.scrollIntoView({ block: 'nearest' });
}

export function rerender() {
  renderTree();
  updateCount();
}

const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');

searchInput.addEventListener('input', () => {
  state.searchQuery = searchInput.value.trim().toLowerCase();
  searchClear.classList.toggle('visible', state.searchQuery.length > 0);
  if (state.searchQuery) expandAll(state.data);
  rerender();
  document.getElementById('no-results').classList.toggle(
    'show', state.searchQuery.length > 0 && state.flatList.length === 0
  );
});

searchClear.addEventListener('click', clearSearch);

function clearSearch() {
  searchInput.value = '';
  state.searchQuery = '';
  searchClear.classList.remove('visible');
  document.getElementById('no-results').classList.remove('show');
  rerender();
}

function expandAll(nodes) {
  nodes.forEach(n => {
    if (n.type === 'folder') {
      state.expandedIds.add(n.id);
      if (n.children) expandAll(n.children);
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  if (e.key === 'Escape') {
    if (state.searchQuery) { clearSearch(); searchInput.blur(); }
  }
});

document.getElementById('tree-scroll').addEventListener('keydown', (e) => {
  const list = state.flatList;
  if (!list.length) return;
  const idx = list.findIndex(item => item.node.id === state.focusedId);

  switch (e.key) {
    case 'ArrowDown': {
      e.preventDefault();
      const next = list[idx + 1];
      if (next) setFocus(next.node.id);
      break;
    }
    case 'ArrowUp': {
      e.preventDefault();
      const prev = list[idx > 0 ? idx - 1 : 0];
      if (prev) setFocus(prev.node.id);
      break;
    }
    case 'ArrowRight': {
      e.preventDefault();
      const cur = list[idx];
      if (cur && cur.node.type === 'folder' && !state.expandedIds.has(cur.node.id)) {
        state.expandedIds.add(cur.node.id);
        rerender();
      }
      break;
    }
    case 'ArrowLeft': {
      e.preventDefault();
      const cur = list[idx];
      if (cur && cur.node.type === 'folder' && state.expandedIds.has(cur.node.id)) {
        state.expandedIds.delete(cur.node.id);
        rerender();
      }
      break;
    }
    case 'Enter': {
      e.preventDefault();
      const cur = list[idx];
      if (!cur) break;
      if (cur.node.type === 'folder') {
        toggleFolder(cur.node.id);
      } else {
        selectFile(cur.node, cur.ancestors);
      }
      break;
    }
  }
});

function updateBreadcrumb(ancestors, file) {
  const bc = document.getElementById('breadcrumb');
  const parts = [...ancestors.map(a => a.name), file.name];
  bc.innerHTML = parts.map((p, i) => {
    if (i === parts.length - 1) return `<span class="bc-current">${p}</span>`;
    return `<span class="bc-seg">${p}</span><span class="bc-sep"> / </span>`;
  }).join('');
}

function updateCount() {
  const total = countAll(state.data);
  const el = document.getElementById('item-count');
  el.textContent = state.searchQuery
    ? `${state.flatList.length} matches`
    : `${total} items`;
}

function countAll(nodes) {
  return nodes.reduce((acc, n) => acc + 1 + (n.children ? countAll(n.children) : 0), 0);
}

fetch('./data.json')
  .then(r => r.json())
  .then(data => {
    state.data = data;
    rerender();
    document.getElementById('tree-scroll').focus();
  })
  .catch(err => {
    console.error('Failed to load data.json:', err);
    document.getElementById('tree-root').innerHTML =
      '<p style="color:red;padding:16px;font-family:monospace">Error loading data.json</p>';
  });