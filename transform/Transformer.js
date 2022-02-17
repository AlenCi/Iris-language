/**
 * AST Transformer
 */
class Transformer {


    /**
     * Translates def syntactic sugar into 
     * a variable lambda expression
     */
    transformDefToVarLambda(defExp) {
        const [_, name, params, body] = defExp;
        const varExp = ["var", name, ["lambda", params, body]];
        return varExp;
    }

    /**
     * Translates switch syntactic sugar into
     * a nested if expression chain
     */
    transformSwitchToIfNested(switchExp) {
        const [_, ...cases] = switchExp;
        const ifExp = ["if", null, null, null];

        let current = ifExp;
        for (let i = 0; i < cases.length - 1; i++) {
            const [currentCond, currentBlock] = cases[i];

            current[1] = currentCond;
            current[2] = currentBlock;

            const next = cases[i + 1];
            const [nextCond, nextBlock] = next;
            current[3] = nextCond === "else" ? nextBlock : ["if"];

            current = current[3];
        }

        return ifExp;
    }

    transformForToWhile(forExp) {
        const [_, init, condition, modifier, body] = forExp;
        const whileBody = ["begin", body, modifier]
        const whileExp = ["begin", init, ["while", condition, whileBody]];
        return whileExp;

    }

}

module.exports = Transformer;