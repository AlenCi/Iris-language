const assert = require("assert");

/*------- Variables -------*/

module.exports = (iris) => {

  assert.strictEqual(iris.eval(["var", "x", 10]), 10);
  assert.strictEqual(iris.eval("x"), 10);
  assert.strictEqual(iris.eval(["var", "y", 30]), 30);
  assert.strictEqual(iris.eval("y"), 30);

  assert.strictEqual(iris.eval(["var", "isUser", "true"]), true);
  assert.strictEqual(iris.eval(["var", "z", ["*", 2, 2]]), 4);
  assert.strictEqual(iris.eval("z"), 4);
};
