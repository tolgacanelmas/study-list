import { css, html, LitElement } from "lit";
import { Router } from "@vaadin/router";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { getLocale, setLocale } from "../localization";

export class AppHeader extends LitElement {
  static styles = css`
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo img {
      width: 30px;
      height: auto;
    }

    .logo span {
      font-weight: 600;
    }

    nav a {
      color: var(--primary-color);
      text-decoration: none;
      margin-left: 1rem;
      cursor: pointer;
      opacity: 0.6;
    }

    nav a.active {
      opacity: 1;
    }

    .lang-switch {
      cursor: pointer;
      display: flex;
    }

    .lang-switch img {
      width: 24px;
      height: auto;
    }
  `;

  static properties = {
    currentPath: { type: String },
  };

  constructor() {
    super();
    this.currentPath = window.location.pathname;
    updateWhenLocaleChanges(this);

    window.addEventListener("vaadin-router-location-changed", (e) => {
      this.currentPath = window.location.pathname;
    });
  }

  render() {
    const locale = getLocale();
    const nextLocale = locale === "en" ? "tr" : "en";

    return html`
      <header>
        <div class="logo">
          <img src="/logo.png" alt="Logo" />
          <span>ING</span>
        </div>

        <div style="display: flex; align-items: center; gap: 2rem;">
          <nav style="display: flex; align-items: center;">
            <a
              style="display:flex;"
              href="/"
              @click=${this.navigate}
              class=${this.currentPath === "/" ? "active" : ""}
            >
              <img src="/employees.svg" alt="Employees" />
              ${msg("Employees")}
            </a>
            <a
              style="display:flex;"
              href="/create"
              @click=${this.navigate}
              class=${this.currentPath === "/create" ? "active" : ""}
            >
              <img src="/add.svg" alt="Add New" />
              ${msg("Add New")}
            </a>
          </nav>

          <div
            class="lang-switch"
            @click=${() => this.localeChanged(nextLocale)}
          >
            ${locale === "en"
              ? html`<img src="/tr-flag.png" alt="Türkçe" />`
              : html`<img src="/en-flag.png" alt="English" />`}
          </div>
        </div>
      </header>
    `;
  }

  navigate(e) {
    e.preventDefault();
    const path = e.currentTarget.getAttribute("href");
    Router.go(path);
    this.currentPath = path;
  }

  localeChanged(newLocale) {
    document.documentElement.lang = newLocale;
    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  }
}

customElements.define("app-header", AppHeader);
