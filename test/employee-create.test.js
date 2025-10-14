import { expect } from "@wdio/globals";
import "../src/pages/employee-create";

describe("EmployeeCreate Component", () => {
  let elem;

  beforeEach(() => {
    elem = document.createElement("employee-create");
    document.body.appendChild(elem);
  });

  afterEach(() => {
    elem.remove();
  });

  it("should be defined", () => {
    expect(customElements.get("employee-create")).toBeDefined();
  });

  it("should render h1 with correct name", () => {
    const h1 = elem.shadowRoot.querySelector(".header-text");
    if (elem.isEditing) {
      expect(h1.innerText).toBe("Edit Employee");
    } else {
      expect(h1.innerText).toBe("Add Employee");
    }
  });

  it("should render <employee-form> inside", () => {
    const form = elem.shadowRoot.querySelector("employee-form");
    expect(form).toBeDefined();
  });
});
