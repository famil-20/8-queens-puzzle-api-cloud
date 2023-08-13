'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const apiKeySchema = new Schema({
	key: {
		type: String,
		required: [true, 'key is missing'],
		unique: [true, 'api-key already exists']
	}
}, { timestamps: true });

const APIKey = mongoose.model('APIKey', apiKeySchema, 'api-keys');

module.exports = APIKey;
