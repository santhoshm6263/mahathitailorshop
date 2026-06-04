// src/app/index.js
import { html } from '../shared/lib/html.js';
import { App } from './App.js';

const React = window.React;
const ReactDOM = window.ReactDOM;

// Boot the premium React Single Page Application
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  html`<${App} />`
);
