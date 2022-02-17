const { test } = require("./test-utils");

/*------- Classes -------*/

module.exports = (iris) => {
	test(
		iris,
		`
		(begin
			(class Point null
				(begin
					(def constructor (this x y)
						(begin
							(set (prop this x) x)
							(set (prop this y) y)
						)
					)	
					(def calc (this)
						(+ (prop this x) (prop this y))
					)
				)				
			)

			(var p (new Point 10 20))

			((prop p calc) p)
		)  
		`,
		30
	);
};
