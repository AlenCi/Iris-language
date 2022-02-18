const assert = require("assert");
const irisParser = require("../parser/irisParser");

function test(iris, code, result) {
	const exp = irisParser.parse(`(begin ${code})`);
	assert.strictEqual(iris.evalGlobal(exp), result);
}

module.exports = {
	test,
};
