const { OpenAPIBackend } = require('openapi-backend');
const path = require('path');
const mongoose = require('mongoose');
const { env } = require('process');

const { generateRandomString } = require('./modules/randomStringGen');
const securityHandlers = require('./handlers/securityHandlers');
const APIKey = require('./models/APIKey');
const taskHandlers = require('./handlers/taskHandlers');
const errorHandlers = require('./handlers/errorHandlers');

const APIKEYLENGTH = env.APIKEYLENGTH;

// Database configuration/connection
const DBURI = env.DBURI;

mongoose.connect(DBURI)
	.then(() => {
		console.log('Connected to DB');
	})
	.catch((error) => {
		console.log(error);
		throw Error('Something bad happened');
	});

// Defining openAPI specification YAML file
const api = new OpenAPIBackend({
	// eslint-disable-next-line no-undef
	definition: path.join(__dirname, '/openAPI/8-queen-puzzle.yaml'),
	quick: true
});

// Registering security schemes
api.registerSecurityHandler('ApiKeyAuth', (c, event) => {
	return securityHandlers.ApiKeyAuth(c, event);
});

api.registerSecurityHandler('AdminAuth', (c, event) => {
	return securityHandlers.AdminAuth(c, event);
});


// Implementing and registering endpoint handlers
api.register({
	getApiKey: async () => {
		let response = {};

		const newAPIKey = generateRandomString(APIKEYLENGTH);
		try {
			await APIKey.create({ key: newAPIKey });
		} catch (error) {
			console.log(error);
			response.statusCode = 500;
			response.body = {
				'errors': error.message
			};
			return response;
		}
		response.body = {
			newAPIKey: newAPIKey
		};
		response.statusCode = 201;
		return response;
	},

	getTask: async (c) => {
		let response = {};
		try {
			const reqBody = JSON.parse(c.request.body);
			response = taskHandlers.getTask(reqBody);
			return response;
		} catch (error) {
			console.log(error);
			response.statusCode = 500;
			response.body = {
				'errors': 'Internal server error'
			};
			return response;
		}
	},

	postTask: async (c) => {
		let response = {};
		try {
			const reqBody = JSON.parse(c.request.body);
			response = taskHandlers.createTask(reqBody);
			return response;
		} catch (error) {
			console.log(error);
			response.statusCode = 500;
			response.body = {
				'errors': 'Internal server error'
			};
			return response;
		}

	},

	unauthorizedHandler: () => {
		let response = {};

		response.headers = {
			'err_authorization': 'Authorization Failed'
		};
		response.statusCode = 401;
		response.body = 'API key is missing or invalid';
		return response;
	},

	validationFail: (c) => {
		let response = {};

		response.statusCode = 400;
		response.body = errorHandlers.validationErrorHandler(c.validation.errors);
		return response;
	}
});

// Initializing api backend
api.init();


exports.handler = async (event, context) => {
	console.log(event);
	console.log(context);
	const response = await api.handleRequest(
		{
			method: event.requestContext.http.method,
			path: event.rawPath,
			query: event.rawQueryString,
			body: event.body,
			headers: event.headers,
		},
		event,
		context
	);
	return response;
};	