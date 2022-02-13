const assert = require("assert");

/*------- Math -------*/

module.exports = (iris) => {
  assert.strictEqual(iris.eval(["+", 1, 5]), 6);
  assert.strictEqual(iris.eval(["*", 1, 5]), 5);
  assert.strictEqual(iris.eval(["+", ["+", 3, 2], 5]), 10);
  assert.strictEqual(iris.eval(["*", ["*", 3, 2], 5]), 30);
};
