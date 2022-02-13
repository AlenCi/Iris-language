const Environment = require("../Environment.js");
const Iris = require("../Iris.js");
const tests = [
  require("./self-eval-test.js"),
  require("./math-test.js"),
  require("./variables-test.js"),
  require("./block-test.js"),
];

/*------------------ Global env -----------------*/

const iris = new Iris(
  new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: "0.1",
  })
);

tests.forEach((test) => test(iris));

console.log("All assertions passed!");
