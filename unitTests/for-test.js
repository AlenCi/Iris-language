const { test } = require("./test-utils");

/*------- For loop -------*/

module.exports = (iris) => {

    test(
        iris,
        `
    (begin
        (var y 3)
        (for
            (var x 0)
            
            (< x 10)

            (set x (+ x 1))
            
            (set y (+ y 10))
            
            
            
            
        )
        y
    )
    
    
    `,
        103
    );
};
