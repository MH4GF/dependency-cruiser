const expect = require("chai").expect;
const extractAMDDeps = require("../../../src/extract/ast-extractors/extract-AMD-deps");
const getASTFromSource = require("../../../src/extract/parse/toJavascriptAST")
  .getASTFromSource;

const extractAMD = (
  pJavaScriptSource,
  pDependencies,
  pExoticRequireStrings = []
) =>
  extractAMDDeps(
    getASTFromSource(pJavaScriptSource, "js"),
    pDependencies,
    pExoticRequireStrings
  );

describe("ast-extractors/extract-AMD-deps", () => {
  it("amd define", () => {
    let lDeps = [];

    extractAMD(
      `define(["./root_one", "./root_two"], function(root_one){ /* do stuff */ });`,
      lDeps
    );
    expect(lDeps).to.deep.equal([
      {
        moduleName: "./root_one",
        moduleSystem: "amd",
        dynamic: false
      },
      {
        moduleName: "./root_two",
        moduleSystem: "amd",
        dynamic: false
      }
    ]);
  });

  it("amd require wrapper", () => {
    let lDeps = [];
    const lInput = `define(function(require, exports, module){
      var one = require('./one-with-require'),
          two = require('./two-with-require');
  });`;

    extractAMD(lInput, lDeps);
    expect(lDeps).to.deep.equal([
      {
        moduleName: "./one-with-require",
        moduleSystem: "amd",
        dynamic: false
      },
      {
        moduleName: "./two-with-require",
        moduleSystem: "amd",
        dynamic: false
      }
    ]);
  });

  it("amd require wrapper with the require parameter named something else", () => {
    let lDeps = [];
    const lInput = `define(function(want, exports, module){
      var one = want('./one-with-want'),
          two = want('./two-with-want');
  });`;

    extractAMD(lInput, lDeps, ["want"]);
    expect(lDeps).to.deep.equal([
      {
        moduleName: "./one-with-want",
        moduleSystem: "amd",
        dynamic: false,
        exoticRequire: "want"
      },
      {
        moduleName: "./two-with-want",
        moduleSystem: "amd",
        dynamic: false,
        exoticRequire: "want"
      }
    ]);
  });
});