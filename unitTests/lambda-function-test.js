const { test } = require("./test-utils");

module.exports = (iris) => {
    test(
        iris,
        `
      (begin 
          
          (def onClick (callback)
              (begin
                (var x 10)
                (var y 20)
                (callback (+ x y))
              )
          )
          
          (onClick (lambda (var) (* var 10)))
      )
      `,
        300
    );

    /*------- IILE -------*/

    test(
        iris,
        `
     ((lambda (x) (* x x)) 3)
    `,
        9
    );

    /*------- Saving lambdas -------*/

    test(
        iris,
        `
    (begin
     (var square (lambda (x) (* x x)))
     (square 3)
    )
    `,
        9
    );
};
