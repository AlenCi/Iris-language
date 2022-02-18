const { test } = require("./test-utils");

const Iris = require("../Iris.js");
const tests = [
	require("./self-eval-test.js"),
	require("./variables-test.js"),
	require("./block-test.js"),
	require("./if-test.js"),
	require("./while-test.js"),
	require("./built-in-function-test.js"),
	require("./user-defined-function-test.js"),
	require("./lambda-function-test.js"),
	require("./switch-test.js"),
	require("./for-test.js"),
	require("./incDec-test.js"),
	require("./class-test.js"),
	require("./module-test.js"),
	require("./import-test.js"),
];


const iris = new Iris();

tests.forEach((test) => test(iris));

test(iris, '(print "Printing works!")');

console.log("All assertions passed!");
