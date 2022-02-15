const assert = require("assert");
const { test } = require("./test-utils");
/*------------------ Blocks -----------------*/

module.exports = (iris) => {
  test(
    iris,
    `
    (begin
      (var x 3)
      (var y 2)
      (+ (* x y) 20)
      
    )
  `,
    26
  );

  /*------- Nested -------*/

  test(
    iris,
    `
    (begin
      (var x 3)
      (begin
        (var x 2)
      )
      x
    )
    `,
    3
  );

  /*------- Identifier resolution / bindings -------*/

  test(
    iris,
    `
    (begin
      (var x 3)
      (var y 
        (begin
          (var z (+ x 5))
          z
        )
      )
      y
    )
    `,
    8
  );

  assert.strictEqual(
    iris.eval([
      "begin",
      ["var", "data", 10],
      ["begin", ["set", "data", 100]],
      "data",
    ]),
    100
  );
};
