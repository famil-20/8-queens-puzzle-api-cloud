'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const taskSchema = new Schema({
	taskId: {
		type: String,
		required: [true, 'taskId is missing'],
		unique: [true, 'taskId already exists']
	},
	result: {
		type: Object,
		required: [true, 'result is missing']
	}
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema, 'task-results');

module.exports = Task;
