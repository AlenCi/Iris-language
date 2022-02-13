const assert = require("assert");
const irisParser = require("../parser/irisParser");

function test(iris, code, result) {
  const exp = irisParser.parse(code);
  assert.strictEqual(iris.eval(exp), result);
}

module.exports = {
  test,
};
