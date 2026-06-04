// src/shared/lib/html.js
import htm from '../vendor/htm.js';

const React = window.React;

/**
 * html acts as our native template compiler in pure ES6 JavaScript.
 * Usage in any module:
 * import { html } from '../shared/lib/html.js';
 * 
 * const MyComponent = () => html`<div className="p-4 bg-maroon">Hello World</div>`;
 */
export const html = htm.bind(React.createElement);
export default html;
