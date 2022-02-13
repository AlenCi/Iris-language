const assert = require("assert");
const Environment = require("./Environment");
/**
 * Iris Interpreter
 * Made by Alen Cigler
 */
class Iris {
  /**
   * Evaluates an expression in the given env
   */
  constructor(global = new Environment()) {
    this.global = global;
  }

  /**
   * Evaluates an expression in the given env
   */
  eval(exp, env = this.global) {
    /*------------------ Self-eval expressions -----------------*/

    if (isNumber(exp)) {
      return exp;
    }
    if (isString(exp)) {
      return exp.slice(1, -1);
    }
    /*------------------ Math operations -----------------*/

    if (exp[0] === "+") {
      return this.eval(exp[1], env) + this.eval(exp[2], env);
    }
    if (exp[0] === "*") {
      return this.eval(exp[1], env) * this.eval(exp[2], env);
    }
    if (exp[0] === "-") {
      return this.eval(exp[1], env) - this.eval(exp[2], env);
    }
    if (exp[0] === "/") {
      return this.eval(exp[1], env) / this.eval(exp[2], env);
    }

    /*------------------ Block -----------------*/

    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv);
    }

    /*------------------ Variable declaration -----------------*/

    if (exp[0] === "var") {
      const [_, name, value] = exp;

      return env.define(name, this.eval(value,env));
    }

    /*------------------ Variable set -----------------*/
    
    if(exp[0] === "set"){
      const [_, name, value] = exp;

      return env.assign(name, this.eval(value,env));
    }

    /*------------------ Variable access -----------------*/
    if (isVariableName(exp)) {
      return env.lookup(exp);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }
  _evalBlock(block, env) {
    let result;
    const [_tag, ...expressions] = block;
    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });
    return result;
  }
}

function isNumber(exp) {
  return typeof exp === "number";
}
function isString(exp) {
  return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
}
function isVariableName(exp) {
  return typeof exp === "string" && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

/*-------------------------------- Tests ------------------------------*/


/*------------------ Global env -----------------*/


const iris = new Iris(
  new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: "0.1",
  })
);


/*------- Self eval -------*/


assert.strictEqual(iris.eval(1), 1);
assert.strictEqual(iris.eval('"Rob"'), "Rob");

/*------- Math -------*/

assert.strictEqual(iris.eval(["+", 1, 5]), 6);
assert.strictEqual(iris.eval(["*", 1, 5]), 5);
assert.strictEqual(iris.eval(["+", ["+", 3, 2], 5]), 10);
assert.strictEqual(iris.eval(["*", ["*", 3, 2], 5]), 30);

/*------- Variables -------*/

assert.strictEqual(iris.eval(["var", "x", 10]), 10);
assert.strictEqual(iris.eval("x"), 10);
assert.strictEqual(iris.eval(["var", "y", 30]), 30);
assert.strictEqual(iris.eval("y"), 30);

assert.strictEqual(iris.eval(["var", "isUser", "true"]), true);
assert.strictEqual(iris.eval(["var", "z", ["*", 2, 2]]), 4);
assert.strictEqual(iris.eval("z"), 4);

/*------------------ Blocks -----------------*/

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
  iris.eval(["begin", ["var", "x", 10], ["begin", ["var", "x", 2], "x"], "x"]),
  10
);

/*------- Identifier resolution / bindings -------*/

assert.strictEqual(
  iris.eval(["begin", ["var", "value", 10],["var","result", ["begin", ["var", "x", ["+","value",10]], "x"]], "result"]),
  20
);

assert.strictEqual(
  iris.eval(["begin", ["var", "data", 10],["begin",["set","data",100]],"data"]),
  100
);

console.log("All assertions passed!");
