import { css, html, LitElement } from "lit";
import "@vaadin/text-field";
import "@vaadin/select";
import "@vaadin/date-picker";
import "@vaadin/button";
import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { Router } from "@vaadin/router";

class EmployeeForm extends LitElement {
  static styles = css`
    .employee-form {
      padding: 2rem;
      background-color: #fff;
    }

    .employee-form-inner {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem 3rem;
      max-width: 90%;
      margin: 0 auto;
    }

    .text-input {
      --vaadin-input-field-border-width: 1px;
      --vaadin-input-field-background: #fff;
      --vaadin-input-field-focused-label-color: #1b2b41b0;
    }

    .employee-form-buttons {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }

    .save-btn {
      background-color: var(--primary-color);
      color: #fff;
      margin-right: 1rem;
      width: 25%;
      cursor: pointer;
    }

    .cancel-btn {
      background-color: #f4f4f4;
      color: #333;
      cursor: pointer;
      width: 25%;
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
    }

    .error-message {
      color: #d32f2f;
      font-size: 0.9rem;
      margin-top: 0.3rem;
    }

    @media (max-width: 1024px) {
      .employee-form-inner {
        grid-template-columns: repeat(2, 1fr);
      }
      .save-btn,
      .cancel-btn {
        width: 40%;
      }
    }

    @media (max-width: 600px) {
      .employee-form-inner {
        grid-template-columns: 1fr;
      }
      .employee-form-buttons {
        flex-direction: column;
        gap: 1rem;
      }
      .save-btn,
      .cancel-btn {
        width: 100%;
        margin-right: 0;
      }
    }
  `;

  static properties = {
    formData: { type: Object },
    errors: { type: Object },
    employees: { type: Array },
  };

  departments = [
    { label: "Analytics", value: "analytics" },
    { label: "Tech", value: "tech" },
  ];

  positions = [
    { label: "Junior", value: "junior" },
    { label: "Medior", value: "medior" },
    { label: "Senior", value: "senior" },
  ];

  constructor() {
    super();

    this.employees = JSON.parse(localStorage.getItem("employeeData")) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const editEmail = urlParams.get("email");
    this.isEditing = urlParams.get("edit") === "true";

    if (this.isEditing) {
      const employeeToEdit = this.employees.find(
        (emp) => emp.email === editEmail
      );
      this.formData = { ...employeeToEdit };
      this.fullName = employeeToEdit.firstName + " " + employeeToEdit.lastName;
    } else {
      this.formData = {
        firstName: "",
        lastName: "",
        dateOfEmployment: "",
        dateOfBirth: "",
        phone: "",
        email: "",
        department: "",
        position: "",
      };
    }

    this.errors = {};
  }

  connectedCallback() {
    super.connectedCallback();
    updateWhenLocaleChanges(this);
  }

  render() {
    return html`
      <div class="employee-form">
        ${this.isEditing
          ? html`<h3 class="header-text">
                ${msg("You are editing")} ${this.fullName}
              </h3>
              :`
          : ""}
        <div class="employee-form-inner">
          ${this.renderInput("firstName", msg("First Name"))}
          ${this.renderInput("lastName", msg("Last Name"))}
          ${this.renderDate("dateOfEmployment", msg("Date of Employment"))}
          ${this.renderDate("dateOfBirth", msg("Date of Birth"))}
          ${this.renderInput("phone", msg("Phone"), {
            placeholder: "(555) 555-5555",
            maxlength: "10",
            pattern: "[0-9()+-]",
          })}
          ${this.renderInput("email", msg("Email"), { type: "email" })}
          ${this.renderSelect(
            "department",
            msg("Department"),
            this.departments
          )}
          ${this.renderSelect("position", msg("Position"), this.positions)}
        </div>

        <div class="employee-form-buttons">
          <vaadin-button class="save-btn" @click=${this.saveEmployee}>
            ${msg("Save")}
          </vaadin-button>
          <vaadin-button class="cancel-btn" @click=${this.cancelEmployee}>
            ${msg("Cancel")}
          </vaadin-button>
        </div>
      </div>
    `;
  }

  renderInput(field, label, options = {}) {
    return html`
      <div class="input-wrapper">
        <vaadin-text-field
          class="text-input"
          label=${label}
          .value=${this.formData[field]}
          placeholder=${options.placeholder || ""}
          maxlength=${options.maxlength || ""}
          allowed-char-pattern=${options.pattern || ""}
          type=${options.type || "text"}
          @input=${(e) => this.updateFormData(field, e.target.value)}
        ></vaadin-text-field>
        ${this.errors[field] &&
        html`<div class="error-message">${this.errors[field]}</div>`}
      </div>
    `;
  }

  renderDate(field, label) {
    return html`
      <div class="input-wrapper">
        <vaadin-date-picker
          class="text-input"
          label=${label}
          .value=${this.formData[field]}
          @value-changed=${(e) => this.updateFormData(field, e.target.value)}
        ></vaadin-date-picker>
        ${this.errors[field] &&
        html`<div class="error-message">${this.errors[field]}</div>`}
      </div>
    `;
  }

  renderSelect(field, label, items) {
    return html`
      <div class="input-wrapper">
        <vaadin-select
          class="text-input"
          label=${label}
          .value=${this.formData[field]}
          .items=${items}
          @value-changed=${(e) => this.updateFormData(field, e.target.value)}
        ></vaadin-select>
        ${this.errors[field] &&
        html`<div class="error-message">${this.errors[field]}</div>`}
      </div>
    `;
  }

  updateFormData(field, value) {
    this.formData = { ...this.formData, [field]: value };
    if (this.errors[field]) {
      const newErrors = { ...this.errors };
      delete newErrors[field];
      this.errors = newErrors;
    }
  }

  saveEmployee() {
    const newErrors = {};
    const urlParams = new URLSearchParams(window.location.search);
    const empEmail = urlParams.get("email");

    Object.entries(this.formData).forEach((prop) => {
      const [key, value] = prop;
      if (!value) {
        newErrors[key] = msg("This field is required");
      }
    });

    const email = this.formData.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = msg("Enter valid email");
    }

    if (this.employees) {
      const hasAlreadyEmailUser = this.employees.find(
        (emp) => emp.email === email
      );
      if (hasAlreadyEmailUser && !urlParams.get("edit")) {
        newErrors.email = msg("This email is taken");
      }
    }

    this.errors = { ...newErrors };

    if (Object.keys(newErrors).length === 0) {
      if (urlParams.get("edit")) {
        const index = this.employees.findIndex((emp) => emp.email === empEmail);
        if (index !== -1) {
          this.employees[index] = this.formData;
          localStorage.setItem("employeeData", JSON.stringify(this.employees));
          Router.go("/");
          return;
        }
      }

      this.employees.unshift(this.formData);
      localStorage.setItem("employeeData", JSON.stringify(this.employees));
      Router.go("/");
    }
  }

  cancelEmployee() {
    Router.go("/");
  }
}

customElements.define("employee-form", EmployeeForm);
