const { test } = require("./test-utils");
/*------- Import -------*/

module.exports = (iris) => {
	test(
		iris,
		`
		(import Math)


		((prop Math abs) (- 10))
		`,
		10
	);

	//todo  Support loading specific values 

	test(
		iris,
		`
		(import Math)


		((prop Math abs) (- 10))
		`,
		10
	);
};
