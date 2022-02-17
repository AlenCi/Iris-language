const { test } = require("./test-utils");

/*------- Built in functions -------*/

module.exports = (iris) => {
    /*------------------ Math & Comparison functions -----------------*/

    test(iris, "(+ 3 3)", 6);
    test(iris, "(+ (+ 1 1) 2)", 4);
    test(iris, "(> 1 5)", false);
    test(iris, "(< 1 5)", true);
    test(iris, "(= 5 5)", true);
};
