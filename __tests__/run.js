const Environment = require("../Environment.js");
const Iris = require("../Iris.js");
const tests = [
  require("./self-eval-test.js"),
  require("./variables-test.js"),
  require("./block-test.js"),
  require("./if-test.js"),
  require("./while-test.js"),
  require("./built-in-function-test.js"),
  require("./user-defined-function-test.js"),
];

/*------------------ Global env -----------------*/

const iris = new Iris();

tests.forEach((test) => test(iris));

iris.eval(["print", '"hello,"','"World"']);

console.log("All assertions passed!");
