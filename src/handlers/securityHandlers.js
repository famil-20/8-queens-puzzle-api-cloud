'use strict';
const { env } = require('process');
const APIKey = require('../models/APIKey');

const APIKEYLENGTH = parseInt(env.APIKEYLENGTH);
const SECRETAPIKEY = env.SECRETAPIKEY;

const checkKeyValidity = function (event) {
	if (event.headers.authorization) {
		const auth = event.headers.authorization;
		if (auth.length === APIKEYLENGTH) {
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
		return event.headers.authorization === SECRETAPIKEY;
	}
	return false;
};

module.exports = {
	ApiKeyAuth,
	AdminAuth
};