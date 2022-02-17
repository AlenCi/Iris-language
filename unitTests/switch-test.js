const { test } = require("./test-utils");

/*------- Built in functions -------*/

module.exports = (iris) => {
	/*------------------ Math & Comparison functions -----------------*/

	test(
		iris,
		`
		(begin
			(var x 10)
			
			(switch 
			
			((= x 10) 100)
			((> x 10) 200)
			(else 300)
			
			
			
			)
			
			
		)
	
	
	
	`,
		100
	);
};
