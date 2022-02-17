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
			(var x 3)
			(++ x)    
			
		)
	
		`,
		4
	);

	test(iris,
		`
		(begin
			(var x 3)
			(-- x)    

		)

		`,
		 2)
};
