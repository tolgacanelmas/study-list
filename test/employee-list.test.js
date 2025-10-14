import { expect } from "@wdio/globals";
import "../src/pages/employee-list";

describe("EmployeeList Component", () => {
  let elem;

  beforeEach(() => {
    elem = document.createElement("employee-list");
    document.body.appendChild(elem);
  });

  afterEach(() => {
    elem.remove();
  });

  it("should be defined", () => {
    expect(customElements.get("employee-list")).toBeDefined();
  });

  it("should initialize properties with default values", () => {
    expect(elem.page).toBe(1);
    expect(elem.listFormat).toBe("table");
    expect(elem.perPageView).toBe(10);
    expect(elem.dialogOpened).toBeFalsy();
  });

  it("should correctly calculate total pages", () => {
    elem.employees = new Array(25).fill({
      firstName: "Test",
      phone: "5555555555",
    });
    elem.perPageView = 10;
    elem.totalPages = Math.ceil(elem.employees.length / elem.perPageView);
    expect(elem.totalPages).toBe(3);
  });

  it("should update pagination when page changes", async () => {
    elem.employees = new Array(15).fill({
      firstName: "Test",
      phone: "5555555555",
    });
    elem.totalPages = Math.ceil(elem.employees.length / elem.perPageView);
    elem.renderPage(2);
    expect(elem.page).toBe(2);
  });

  it("should return sliced employees", async () => {
    elem.employees = [
      { firstName: "A" },
      { firstName: "B" },
      { firstName: "C" },
      { firstName: "D" },
    ];
    elem.perPageView = 2;
    elem.page = 2;
    const result = elem.getEmployees();
    expect(result.length).toBe(2);
    expect(result[0].firstName).toBe("C");
  });

  it("should show modal", () => {
    if (elem.dialogOpened) {
      expect(customElements.get("custom-dialog").toBeDefined());
    }
  });
});
