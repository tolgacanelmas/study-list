import { css, html, LitElement } from "lit";
import "../components/employee-form";
import { msg, updateWhenLocaleChanges } from "@lit/localize";

class EmployeeCreate extends LitElement {
  static styles = css`
    .employee-create {
      padding: 1rem 2rem;
      background-color: #f4f4f4;
      color: #333;
    }
    .header-text {
      font-size: 1.5rem;
      color: var(--primary-color);
      font-weight: 600;
      margin: 0;
      margin-bottom: 2rem;
    }
  `;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    updateWhenLocaleChanges(this);

    const urlParams = new URLSearchParams(window.location.search);
    this.isEditing = urlParams.get("edit") === "true";
  }

  render() {
    return html`
      <div class="employee-create">
        <h1 class="header-text">
          ${this.isEditing ? msg("Edit Employee") : msg("Add Employee")}
        </h1>
        <employee-form></employee-form>
      </div>
    `;
  }
}

customElements.define("employee-create", EmployeeCreate);
