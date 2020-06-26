const expect = require("chai").expect;
const isRelativeModuleName = require("~/src/extract/resolve/is-relative-module-name");

describe("extract/resolve/isRelativeModuleName", () => {
  it("throws an error when passed nothing", () => {
    expect(() => {
      isRelativeModuleName();
    }).to.throw("Cannot read property 'startsWith' of undefined");
  });

  it("throws an error when passed null", () => {
    expect(() => {
      isRelativeModuleName(null);
    }).to.throw("Cannot read property 'startsWith' of null");
  });

  it("returns false when passed an empty string", () => {
    expect(isRelativeModuleName("")).to.equal(false);
  });

  it("returns false when passed an external module", () => {
    expect(isRelativeModuleName("externaldash")).to.equal(false);
  });

  it("returns false when passed an external module name that starts with a dot", () => {
    expect(isRelativeModuleName(".external-starts-with-a-dot")).to.equal(false);
  });

  it("returns true when passed a local module in the same folder", () => {
    expect(isRelativeModuleName("./path")).to.equal(true);
  });

  it("returns true when passed a local module in a sub folder", () => {
    expect(isRelativeModuleName("../../halikidee")).to.equal(true);
  });

  it("returns true when passed the current folder", () => {
    expect(isRelativeModuleName(".")).to.equal(true);
  });

  it("returns true when passed the parent folder", () => {
    expect(isRelativeModuleName("..")).to.equal(true);
  });
});
