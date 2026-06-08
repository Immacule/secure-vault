# SecureVault Dashboard

A modern, high-performance file explorer UI for enterprise cloud storage. Built for law firms and banks who need to navigate deeply nested folder structures with speed and precision.

---

## Live Demo

> secure-vault-jbrp.vercel.app


---

## Design File

> https://design.penpot.app/#/view?file-id=86bdcaa1-299a-806a-8008-23a6c4a38231&page-id=86bdcaa1-299a-806a-8008-23a6c4a38232&section=interactions&index=0&share-id=86bdcaa1-299a-806a-8008-24de26362685

---

## Overview

SecureVault Dashboard is a Visual File Explorer built for the AmaliTech DEG Project-based Challenge. The client, SecureVault Inc., provides high-security cloud storage for law firms and banks. Their existing frontend was a flat list that made navigating nested case files frustrating and error-prone.

This project replaces it with a recursive, keyboard-accessible, searchable file explorer — built entirely from scratch with no component libraries.

---

## Features

| Feature | Description |
|---|---|
| Recursive File Tree | Renders any depth of nested folders from JSON |
| Expand / Collapse | Click any folder to expand or collapse its contents |
| Properties Panel | Select a file to view its Name, Type, Size, Path, and Depth |
| Keyboard Navigation | Full keyboard support no mouse required |
| Search | Real-time search with auto-expand and match highlighting |
| Copy Full Path | One-click copy of the full folder path to clipboard |

---

## Tech Stack

- **Vanilla JavaScript (ES Modules)** zero framework dependencies
- **HTML5 & CSS3** custom design system, no UI libraries
- **Vite** development server and production bundler

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- [Git](https://git-scm.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Immacule/secure-vault.git

# 2. Navigate into the project
cd secure-vault

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open your browser and go to `http://localhost:3000`

### Production Build

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy on Netlify, Vercel, or any static host.

---

## Project Structure

```
secure-vault/
├── public/
│   └── data.json          # Vault data (simulates backend API response)
├── src/
│   ├── main.js            # App state, search, keyboard navigation, boot
│   ├── tree.js            # Recursive tree renderer
│   └── properties.js      # File properties panel
├── index.html             # App shell + design system CSS
├── data.json              # Source data
├── package.json
└── vite.config.js
```

---

## Recursive Strategy

The core of this project is the `renderNodes` function in `src/tree.js`. It uses **depth-first traversal** to walk the JSON tree recursively.

```js
function renderNodes(nodes, container, depth, ancestors) {
  nodes.forEach(node => {
    // 1. Build the DOM element for this node
    // 2. Push it to the flat list for keyboard navigation
    // 3. If it's a folder, recurse into its children
    if (isFolder && node.children) {
      renderNodes(node.children, childWrap, depth + 1, [...ancestors, node]);
    }
  });
}
```

**Why this works at any depth:**
- The function never assumes a fixed level it always passes `depth + 1` to itself
- Indentation is handled via a CSS variable `--depth` set per node: `padding-left: calc(16px + var(--depth) * 16px)`
- The `ancestors` array tracks the full path from root to current node, enabling breadcrumb display and the Copy Path feature
- Collapsed folders simply hide their `tree-children` wrapper via `display: none` the DOM is always fully built, making expand/collapse instant

---

## Wildcard Feature Copy Full Path

**Feature:** A "Copy Full Path" button in the Properties Panel that copies the complete folder path of the selected file to the clipboard with one click.

**Example output:**
```
01_Legal_Department / Active_Cases / Doe_vs_MegaCorp_Inc / Case_Summary_Draft_v3.docx
```

**Why I chose this:**

Law firms and IT security teams constantly reference file paths in emails, audit logs, legal documents, and support tickets. Without this feature, users have to manually read and type out the path — which is slow and error-prone in deeply nested structures.

One click eliminates that friction entirely. It also directly supports SecureVault's core value proposition: precision and speed for high-stakes professional users.

---

## Design System

The visual language follows SecureVault's brand guideline: **"cyber-secure, precise, and fast."**

| Token | Value |
|---|---|
| Primary Background | `#07090f` |
| Surface | `#0c0f1a` |
| Accent | `#2563eb` |
| Success | `#22c55e` |
| Font — UI | Outfit (Google Fonts) |
| Font — Mono | IBM Plex Mono (Google Fonts) |
| Base Spacing | 4px grid |
| Border Radius | 4px / 6px / 10px |

---
