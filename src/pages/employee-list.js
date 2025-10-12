import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { Router } from "@vaadin/router";
import { css, html, LitElement } from "lit";
import { formatPhone } from "../utils/helper";

class EmployeeList extends LitElement {
  static styles = css`
    .employee-list {
      padding: 1rem 2rem;
      background-color: #f4f4f4;
      color: #333;
    }
    .header-text {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
      font-weight: 600;
      margin: 0;
    }

    .table-container {
      padding: 2rem;
      background-color: #fff;
      overflow:auto;
    }

    .shape {
      width: 40px;
      height: 40px;
      margin-left: 0.5rem;
      cursor: pointer;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      color: var(--primary-color);
      font-weight: 600;
      font-size: 0.9rem;
    }

    .card-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem 3rem;
    }

    .card-inner {
      margin:2rem;
      background-color:#fff;
      padding:1rem;
      gap:1rem;
      box-shadow:0px 2px 6px 0px rgba(0,0,0,0.4);
    }

    .card {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap:1rem;
    }

    .card p {
      margin:0;
      color:#000;
      font-weight:600;
    }

    .card span {
      color:gray;
    }

    .card-buttons {
      display:flex;
      margin-top:2rem;
    }

    .edit, .delete {
      display:flex;
      align-items:center;
      margin-right:1rem;
      border-radius: 8px;
      border:1px solid var(--primary-color);
      padding:0.5rem 1rem;
      color: var(--primary-color);
      cursor:pointer;
    }

    .pagination {
      display:flex;
      justify-content:center;
      margin-top:2rem;
    }

    .pagination span {
      margin: 0 0.5rem;
      padding: 4px 8px;
      border-radius:9999px;
      cursor:pointer;
    }

    .pagination span.active {
      background-color: var(--primary-color);
      color:#fff;
    }

    .custom-dialog {
      width:100%;
      height:100%;
      position:absolute;
      top:0;
      left:0;
      background: rgba(0,0,0,0.4);
      display:flex;
      justify-content: center;
      align-items: center;
      z-index:1000;
    }

    .modal-content {
      background-color: #fefefe;
      padding: 20px;
      border-radius: 8px;
      width: 400px;
      max-width: 90%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      animation: fadein 0.3s;
    }

    .dialog-header {
      color: var(--primary-color);
      margin:0;
    }

    .submit {
      width:100%;
      background-color: var(--primary-color);
      border:none;
      padding: 0.5rem 1rem;
      color:#fff;
      cursor:pointer;
      font-size: 1rem;
    }

    .close {
      width:100%;
      padding: 0.5rem 1rem;
      color:#fff;
      font-size: 1rem;
      border: 1px solid #a1a9b1;
      background: none;
      color:#a1a9b1;
      border-radius:8px;
      margin-top:0.5rem;
      cursor:pointer;
    }

    @media (max-width: 992px) {
      .card-container {
        gap: 1rem 1.5rem;
      }

      .card-inner {
        margin:0.5rem;
      }
    }

    @media (max-width: 768px) {
      .employee-list {
        padding: 1rem;
      }
      .table-container{
        padding: 1rem;
      }
      .card-container {
        grid-template-columns: repeat(1, 1fr);
      }
  `;

  static properties = {
    dialogOpened: { type: Boolean },
    page: { type: Number },
    listFormat: { type: String },
    perPageView: { type: Number },
    totalPages: { type: Number },
    selectedUser: { type: Object },
  };

  constructor() {
    super();
    this.employees = JSON.parse(localStorage.getItem("employeeData") || "[]");
    this.page = 1;
    this.listFormat = "table";
    this.perPageView = 10;
    this.totalPages = Math.ceil(this.employees.length / this.perPageView);
    this.selectedUser = null;
  }

  connectedCallback() {
    super.connectedCallback();
    updateWhenLocaleChanges(this);
  }

  willUpdate(changedProperties) {
    if (changedProperties.has("listFormat")) {
      this.listFormat = this.listFormat === "table" ? "table" : "card";
      this.perPageView = this.listFormat === "table" ? 10 : 4;
      this.totalPages = Math.ceil(this.employees.length / this.perPageView);
    }
  }

  getEmployees() {
    const start = (this.page - 1) * this.perPageView;
    const end = this.page * this.perPageView;
    return this.employees.slice(start, end);
  }

  render() {
    return html`
      <div class="employee-list">
        <div
          style="display: flex; justify-content: space-between; align-items: center;"
        >
          <h1 class="header-text">${msg("Employee List")}</h1>

          <div>
            <img
              src="table-list.svg"
              class="shape"
              @click=${() => {
                this.listFormat = "table";
              }}
            />
            <img
              src="card-list.svg"
              class="shape"
              @click=${() => {
                this.listFormat = "card";
              }}
            />
          </div>
        </div>

        <div>
          ${this.listFormat === "table"
            ? html`${this.renderTableFormat()}`
            : html`${this.renderCardFormat()}`}

          <div class="pagination">${this.renderPagination()}</div>
        </div>

        ${this.dialogOpened
          ? html` <div
           @click=${(e) => {
             if (e.target.classList.contains("custom-dialog")) {
               this.dialogOpened = false;
             }
           }}
          class="custom-dialog"
          .opened="${this.dialogOpened}"
          <div>
            <div class="modal-content">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <h3 class="dialog-header">Are you sure?</h3>
                
                <img @click=${() => {
                  this.dialogOpened = false;
                }} src="close.svg" style="width: 30px; height: 30px; margin-left: 0.5rem; cursor:pointer;" />
              </div>

              <p>
               Selected Employee record of <strong>${
                 this.selectedUser.firstName + " " + this.selectedUser.lastName
               }</strong> will be deleted
              </p>
              
              <button class="submit" @click=${() => {
                const index = this.employees.findIndex(
                  (emp) => emp.email === this.selectedUser.email
                );

                this.employees.splice(index, 1);
                localStorage.setItem(
                  "employeeData",
                  JSON.stringify(this.employees)
                );
                this.dialogOpened = false;
              }}>Proceed</button>
              <button class="close" @click=${() => {
                this.dialogOpened = false;
              }}>Cancel</button>
            </div>

          </div>
        ></div>`
          : ""}
      </div>
    `;
  }

  renderTableFormat() {
    return html`
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>${msg("First Name")}</th>
              <th>${msg("Last Name")}</th>
              <th>${msg("Date of Employment")}</th>
              <th>${msg("Date of Birth")}</th>
              <th>${msg("Phone")}</th>
              <th>${msg("Email")}</th>
              <th>${msg("Department")}</th>
              <th>${msg("Position")}</th>
              <th>${msg("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            ${this.getEmployees().map(
              (emp) => html`
                <tr>
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td>${emp.dateOfEmployment}</td>
                  <td>${emp.dateOfBirth}</td>
                  <td>${formatPhone(emp.phone)}</td>
                  <td>${emp.email}</td>
                  <td>${emp.department}</td>
                  <td>${emp.position}</td>
                  <td>
                    <img
                      src="edit.svg"
                      style="width: 20px; height: 20px; cursor: pointer; margin-right: 0.5rem;"
                      @click=${() =>
                        Router.go(`/create?edit=true&email=${emp.email}`)}
                    />
                    <img
                      src="delete.svg"
                      style="width: 20px; height: 20px; cursor: pointer;"
                      @click="${() => {
                        this.dialogOpened = true;
                        this.selectedUser = emp;
                      }}"
                    />
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  renderCardFormat() {
    return html`
      <div class="card-container">
        ${this.getEmployees().map((emp) => {
          return html`
            <div class="card-inner">
              <div class="card">
                <div>
                  <span>${msg("First Name")}:</span>
                  <p>${emp.firstName}</p>
                </div>

                <div>
                  <span>${msg("Last Name")}:</span>
                  <p>${emp.lastName}</p>
                </div>

                <div>
                  <span>${msg("Date of Employment")}:</span>
                  <p>${emp.dateOfEmployment}</p>
                </div>

                <div>
                  <span>${msg("Date of Birth")}:</span>
                  <p>${emp.dateOfBirth}</p>
                </div>

                <div>
                  <span>${msg("Phone")}:</span>
                  <p>${formatPhone(emp.phone)}</p>
                </div>

                <div>
                  <span>${msg("Email")}:</span>
                  <p>${emp.email}</p>
                </div>

                <div>
                  <span>${msg("Department")}:</span>
                  <p>${emp.department}</p>
                </div>

                <div>
                  <span>${msg("Position")}:</span>
                  <p>${emp.position}</p>
                </div>
              </div>

              <div class="card-buttons">
                <div
                  class="edit"
                  @click=${() =>
                    Router.go(`/create?edit=true&email=${emp.email}`)}
                >
                  <img
                    src="edit.svg"
                    style="width: 30px; height: 30px; cursor: pointer; margin-right: 0.5rem;"
                  />

                  <span>${msg("Edit")}</span>
                </div>
                <div
                  class="delete"
                  @click="${() => {
                    this.dialogOpened = true;
                    this.selectedUser = emp;
                  }}"
                >
                  <img
                    src="delete.svg"
                    style="width: 30px; height: 30px; cursor: pointer;"
                  />

                  <span>${msg("Delete")}</span>
                </div>
              </div>
            </div>
          `;
        })}
      </div>
    `;
  }

  renderPagination() {
    const total = this.totalPages;
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }

    return html`
      ${pages.map((p) => {
        return html`
          <span
            class=${p === this.page ? "active" : ""}
            @click=${() => this.renderPage(p)}
            >${p}</span
          >
        `;
      })}
    `;
  }

  renderPage(p) {
    this.page = p;
  }
}

customElements.define("employee-list", EmployeeList);
