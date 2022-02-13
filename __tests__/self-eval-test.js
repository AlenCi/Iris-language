const assert = require("assert");

/*------- Self eval -------*/

module.exports = (iris) => {
  assert.strictEqual(iris.eval(1), 1);
  assert.strictEqual(iris.eval('"Rob"'), "Rob");
};
