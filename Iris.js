const Environment = require("./Environment");
/**
 * Iris Interpreter
 * Made by Alen Cigler
 */
class Iris {
  /**
   * Evaluates an expression in the given env
   */
  constructor(global = GlobalEnvironment) {
    this.global = global;
  }

  /**
   * Evaluates an expression in the given env
   */
  eval(exp, env = this.global) {
    /*------------------ Self-evaluating expressions -----------------*/

    if (this._isNumber(exp)) {
      return exp;
    }
    if (this._isString(exp)) {
      return exp.slice(1, -1);
    }

    /*------------------ Block -----------------*/

    if (exp[0] === "begin") {
      const blockEnv = new Environment({}, env);
      return this._evalBlock(exp, blockEnv); // Evaluates the whole block in a nested environment
    }

    /*------------------ Variable declaration -----------------*/

    if (exp[0] === "var") {
      const [_, name, value] = exp;

      return env.define(name, this.eval(value, env));
    }

    /*------------------ Variable set -----------------*/

    if (exp[0] === "set") {
      const [_, name, value] = exp;

      return env.assign(name, this.eval(value, env));
    }

    /*------------------ Variable access -----------------*/
    if (this._isVariableName(exp)) {
      return env.lookup(exp);
    }

    /*------------------ If expression -----------------*/

    if (exp[0] === "if") {
      /*
        Main gets evaluated when true
        Alternate gets evaluated when false
      */
      const [_, condition, main, alternate] = exp;
      if (this.eval(condition, env)) {
        return this.eval(main, env);
      } else {
        return this.eval(alternate, env);
      }
    }

    /*------------------ While expression -----------------*/

    if (exp[0] === "while") {
      const [_, condition, body] = exp;
      let result;
      while (this.eval(condition, env)) {
        result = this.eval(body, env);
      }
      return result;
    }

    /*------------------ Function declaration -----------------*/

    if (exp[0] === "def") {
      const [_, name, params, body] = exp;
      const fn = {
        params,
        body,
        env,
      };

      return env.define(name, fn); // mapping from property to method
    }

    /*------------------ Function calls -----------------*/

    if (Array.isArray(exp)) {
      const fn = this.eval(exp[0], env);

      const args = exp.slice(1).map((arg) => this.eval(arg, env));

      /*------- Native function -------*/

      if (typeof fn === "function") {
        return fn(...args);
      }

      /*------- Custom function -------*/

      const activationRecord = {};

      fn.params.forEach((param, index) => {
        activationRecord[param] = args[index];
      });

      const activationEnv = new Environment(activationRecord, fn.env);

      return this._evalBody(fn.body, activationEnv);
    }

    throw `Unimplemented: ${JSON.stringify(exp)}`;
  }

  /*------- Helper methods -------*/

  _evalBody(body, env) {
    // Method body can be either a block or an expression
    if (body[0] === "begin") {
      return this._evalBlock(body, env);
    }
    return this.eval(body, env);
  }

  _evalBlock(block, env) {
    // Evaluates every expression within a block
    let result;
    const [_tag, ...expressions] = block;
    expressions.forEach((exp) => {
      result = this.eval(exp, env);
    });
    return result;
  }

  _isNumber(exp) {
    return typeof exp === "number";
  }
  _isString(exp) {
    return typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"';
  }
  _isVariableName(exp) {
    return typeof exp === "string" && /^[+\-*/<>=a-zA-Z0-9_]*$/.test(exp); // Symbols are variables
  }
}

/**
 * Default global environment
 */

const GlobalEnvironment = new Environment({
  null: null,
  true: true,
  false: false,
  VERSION: "0.1",

  /*------------------ Math operations -----------------*/

  // String property accessors that map to methods

  "+"(op1, op2) {
    return op1 + op2;
  },
  "-"(op1, op2 = null) {
    if (op2 == null) {
      return -op1;
    }
    return op1 - op2;
  },
  "*"(op1, op2) {
    return op1 * op2;
  },
  "/"(op1, op2) {
    return op1 / op2;
  },
  /*------------------ Comparison operators -----------------*/
  ">"(op1, op2) {
    return op1 > op2;
  },
  "<"(op1, op2) {
    return op1 < op2;
  },
  ">="(op1, op2) {
    return op1 >= op2;
  },
  "<="(op1, op2) {
    return op1 <= op2;
  },
  "="(op1, op2) {
    return op1 === op2;
  },
  "!="(op1, op2) {
    return op1 !== op2;
  },

  /*------- Console output -------*/

  print(...args) {
    console.log(...args);
  },
});

module.exports = Iris;
