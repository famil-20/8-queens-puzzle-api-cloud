const AWS = require('aws-sdk');
const { generateRandomString } = require('../modules/randomStringGen');
const Task = require('../models/Task');

const lambda = new AWS.Lambda();


const getTask = async (reqBody) => {
	let response = {};
	const taskId = reqBody.taskId;
	const resultObj = await Task.findOne({ taskId: taskId });
	if (resultObj) {
		await Task.findOneAndDelete({ taskId: taskId });
		response.body = {
			'taskId': taskId,
			'result': resultObj.result
		};
		response.statusCode = 200;
		return response;
	}

	response.statusCode = 400;
	response.body = {
		'errors': 'Invalid task id'
	};
	return response;
};

const createTask = async (reqBody) => {
	let response = {};
	const input = parseInt(reqBody.input);
	const payload = {
		resource: '/',
		path: '/',
		httpMethod: 'POST',
		headers: {
			// ... headers
		},
		queryStringParameters: {
			// ... query string parameters
		},
		body: JSON.stringify({
			'input': input
		})
	};
	const params = {
		FunctionName: 'testJava2',
		InvocationType: 'RequestResponse',
		Payload: JSON.stringify(payload)
	};
	try {
		const responseInvoke = await lambda.invoke(params).promise();
		const result = JSON.parse(responseInvoke.Payload);
		const taskId = generateRandomString(10);
		await Task.create({ 'taskId': taskId, 'result': result.body });
		response.statusCode = 201;
		response.body = {
			'taskId': taskId
		};
		return response;
	} catch (error) {
		console.log(error);
		response.statusCode = 500;
		response.body = {
			'errors': 'Solver encountered error'
		};
		return response;
	}
};

module.exports = {
	getTask,
	createTask
};