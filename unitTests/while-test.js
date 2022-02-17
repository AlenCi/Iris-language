const assert = require("assert");

/*------- While loop -------*/

module.exports = (iris) => {
  assert.strictEqual(
	iris.eval([
	  "begin",
	  ["var", "x", 1],
	  ["var", "y", 0],

	  [
		"while",
		["<", "x", 9],
		["begin", ["set", "y", ["+", "y", 1]], ["set", "x", ["+", "x", 1]]],
	  ],

	  "y",
	]),
	8
  );
};
