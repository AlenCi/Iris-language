const Environment = require("./Environment");
const Transformer = require("./transform/Transformer");
const irisParser = require("./parser/irisParser");

const fs = require("fs");

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
		this._transformer = new Transformer();
	}

	/**
	 * Evaluates global code by wrapping it into a block implicitly
	 */
	evalGlobal(expressions) {
		return this._evalBody(expressions, this.global);
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
			const [_, ref, value] = exp;

			// Prop assignment
			if (ref[0] === "prop") {
				const [_, instance, propName] = ref;
				const instanceEnv = this.eval(instance, env);
				return instanceEnv.define(propName, this.eval(value, env));
			}

			// Var assignment
			return env.assign(ref, this.eval(value, env));
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

		// This is syntactic sugar for lambda variables

		if (exp[0] === "def") {
			// JIT-transpile to variable declaration

			const varExp = this._transformer.transformDefToVarLambda(exp);
			return this.eval(varExp, env);
		}

		/*------------------ Syntactic sugar -----------------*/

		if (exp[0] === "switch") {
			const ifExp = this._transformer.transformSwitchToIfNested(exp);

			return this.eval(ifExp, env);
		}

		if (exp[0] === "for") {
			const forExp = this._transformer.transformForToWhile(exp);
			return this.eval(forExp, env);
		}

		if (exp[0] === "++") {
			const incExp = this._transformer.transformIncToAdd(exp);
			return this.eval(incExp, env);
		}

		if (exp[0] === "--") {
			const decExp = this._transformer.transformDecToSub(exp);
			return this.eval(decExp, env);
		}

		/*------- Lambda functions -------*/

		if (exp[0] === "lambda") {
			const [_, params, body] = exp;
			return {
				params,
				body,
				env,
			};
		}

		/*------------------ Class declaration -----------------*/

		if (exp[0] === "class") {
			const [_, name, parent, body] = exp;
			// Class is an env

			// Inheritance support
			const parentEnv = this.eval(parent, env) || env;

			const classEnv = new Environment({}, parentEnv);

			// Body is evaled in the class env
			this._evalBody(body, classEnv);

			// Class by name
			return env.define(name, classEnv);
		}

		/*------------------ Super expressions -----------------*/

		if (exp[0] === "super") {
			const [_, name] = exp;
			return this.eval(name, env).parent;
		}

		/*------------------ Class instantiation -----------------*/

		if (exp[0] === "new") {
			// Obtain the class in our current environment
			const classEnv = this.eval(exp[1], env);
			/**
			 * The instance is
			 * also an environment
			 * Parent component of the instance is
			 * set to its class
			 */
			const instanceEnv = new Environment({}, classEnv);

			// Obtain the arguments and evaluate them in the current environment
			const args = exp.slice(2).map((arg) => this.eval(arg, env));

			// Call the constructor in the instance environment with the arguments
			this._callUserDefinedFunction(classEnv.lookup("constructor"), [
				instanceEnv,
				...args,
			]);

			return instanceEnv;
		}

		/*------------------ Property access -----------------*/

		if (exp[0] === "prop") {
			const [_, instance, name] = exp;
			const instanceEnv = this.eval(instance, env);
			return instanceEnv.lookup(name);
		}

		/*------------------ Module -----------------*/

		if (exp[0] === "module") {
			const [_, name, body] = exp;

			const moduleEnv = new Environment({}, env);

			this._evalBody(body, moduleEnv);

			return env.define(name, moduleEnv);
		}

		/*------------------ Import module -----------------*/

		if (exp[0] === "import") {
			//todo  Cache modules

			const [_, name] = exp;

			const moduleSrc = fs.readFileSync(
				`${__dirname}/modules/${name}.iris`,
				"utf-8"
			);

			const body = irisParser.parse(`(begin ${moduleSrc})`);

			const moduleExp = ["module", name, body];

			return this.eval(moduleExp, this.global);
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

			return this._callUserDefinedFunction(fn, args);
		}

		throw `Unimplemented: ${JSON.stringify(exp)}`;
	}

	_callUserDefinedFunction(fn, args) {
		const activationRecord = {};

		fn.params.forEach((param, index) => {
			activationRecord[param] = args[index];
		});

		const activationEnv = new Environment(activationRecord, fn.env);
		return this._evalBody(fn.body, activationEnv);
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
		return (
			typeof exp === "string" && exp[0] === '"' && exp.slice(-1) === '"'
		);
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
