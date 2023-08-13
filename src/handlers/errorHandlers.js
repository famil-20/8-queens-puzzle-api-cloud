const validationErrorHandler = (errors) => {
	const errLength = errors.length;
	const errorBody = {
		errors: ''
	};
	if (errLength > 0) {
		for (let i = 0; i < errLength; i++) {
			errorBody.errors += errors[i].instancePath + ' ';
			errorBody.errors += errors[i].message + ' | ';
		}
	}
	return errorBody;
};

module.exports = {
	validationErrorHandler
};