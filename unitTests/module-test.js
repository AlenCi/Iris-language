const { test } = require("./test-utils");
/*------- Module -------*/

module.exports = (iris) => {
	test(
		iris,
		`
		(module Math
			(begin
				(def abs (value)
					(if (< value 0)
						(- value)
						(value)
					)
				
				)
				
				(def square (x)
					(* x x)
				)

				(var MAX_VALUE 1000)
				
			)
		
		)  

		((prop Math abs) (- 10))
		`,
		10
	);

	test(
		iris,
		`
			(var abs (prop Math abs))

			(abs (- 10))
		
		
		
		`,
		10
	);
};
