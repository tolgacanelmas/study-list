import { html, LitElement } from "lit";
import "./components/app-header";

class AppLayout extends LitElement {
  render() {
    return html`
      <app-header></app-header>

      <main>
        <slot></slot>
      </main>
    `;
  }
}

customElements.define("app-layout", AppLayout);
