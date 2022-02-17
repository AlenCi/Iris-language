const assert = require("assert");
const { test } = require("./test-utils");

/*------- Custom functions -------*/

module.exports = (iris) => {
    test(
        iris,
        `
    (begin 
        
        (def square (x)
            (* x x))
        
        (square 2)
    )
    `,
        4
    );

    test(
        iris,
        `
    (begin 
        
        (def calc (x y)
            (begin 
                (var z 30)
                (+ (* x y) z)
            )
        )
        
        (calc 10 20)
    )
    `,
        230
    );

    test(
        iris,
        `
    (begin 

        (var val 100)
        
        (def calc (x y)
            (begin 
                (var z (+ x y))
                (def inner (foo)
                   (+ 
                    (+ foo z)
                    val
                   )
                )
                inner
            )
        )
        
        (var fn (calc 10 20))
        (fn 30)
    )
    `,
        160
    );

    test(
        iris,
        `
    (begin 
        
        (def factorial (x)
            (if (= x 1)
                1
                (* x (factorial (- x 1)))
            )
        )
        
        (factorial 3)
    )
    `,
        6
    );
};
