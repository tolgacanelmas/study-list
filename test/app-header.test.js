import { expect } from "@wdio/globals";
import "../src/components/app-header.js";

describe("AppHeader Component", () => {
  let elem;

  beforeEach(() => {
    elem = document.createElement("app-header");
    document.body.appendChild(elem);
  });

  afterEach(() => {
    elem.remove();
  });

  it("should be defined", () => {
    expect(customElements.get("app-header")).toBeDefined();
  });

  it("return current path", () => {
    expect(elem.currentPath).toBe(window.location.pathname);
  });

  it("should update document lang", async () => {
    elem.localeChanged("tr");
    expect(document.documentElement.lang).toBe("tr");
  });
});
