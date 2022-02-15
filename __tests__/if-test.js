const { test } = require("./test-utils");
/*------- If expressions -------*/

/**
 * (if condition true false)
 */
module.exports = (iris) => {
  test(
    iris,
    `
  
  (begin
    (var x 1)
    (var y 0)
    (if (> x 1)
      (set y 2)
      (set y 3)   
    )  

    y
    
  )  
  `,
    3
  );
};
