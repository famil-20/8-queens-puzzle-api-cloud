'use strict';
const { env } = require('process');
const APIKey = require('../models/APIKey');

const APIKEYLENGTH = env.APIKEYLENGTH;
const SECRETAPIKEY = env.SECRETAPIKEY;

const checkKeyValidity = function (event) {
	console.log(APIKEYLENGTH);
	if (event.headers.authorization) {
		const auth = event.headers.authorization;
		console.log(auth.length);
		if (auth.length === APIKEYLENGTH) {
			console.log('test');

			return true;
		}
	}
	return false;
};

const ApiKeyAuth = async function (c, event) {
	if (checkKeyValidity(event)) {
		if (await APIKey.exists({ key: event.headers.authorization })) {
			return true;
		}
	}

	return false;
};

const AdminAuth = function (c, event) {
	if (checkKeyValidity(event)) {
		console.log(SECRETAPIKEY);
		return event.headers.authorization === SECRETAPIKEY;
	}
	return false;
};

module.exports = {
	ApiKeyAuth,
	AdminAuth
};