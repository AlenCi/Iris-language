const assert = require("assert");
const testUtil = require("./test-utils");
/*------------------ Blocks -----------------*/

module.exports = (iris) => {
  assert.strictEqual(
    iris.eval([
      "begin",
      ["var", "x", 10],
      ["var", "y", 20],
      ["+", ["*", "x", "y"], 30],
    ]),
    230
  );

  /*------- Nested -------*/

  assert.strictEqual(
    iris.eval([
      "begin",
      ["var", "x", 10],
      ["begin", ["var", "x", 2], "x"],
      "x",
    ]),
    10
  );

  /*------- Identifier resolution / bindings -------*/

  assert.strictEqual(
    iris.eval([
      "begin",
      ["var", "value", 10],
      ["var", "result", ["begin", ["var", "x", ["+", "value", 10]], "x"]],
      "result",
    ]),
    20
  );

  assert.strictEqual(
    iris.eval([
      "begin",
      ["var", "data", 10],
      ["begin", ["set", "data", 100]],
      "data",
    ]),
    100
  );

  testUtil.test(iris,
    `
    (begin
      (var x 10)
      (var y 20)               
      (+ (* x 10) y)
    )`,
    120
  );
};
