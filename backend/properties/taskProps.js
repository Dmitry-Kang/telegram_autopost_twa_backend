const taskTypes = ["LIKE", "RETWEET", "COMMENT", "POST", "DM"]
const taskStatus = [ "PENDING", "INPROGRESS", "COMPLETED", "FAILED" ]
const updateTaskStatus = [ "COMPLETED", "FAILED" ]
const accountStatus = ["WAITING_TASK", "PROCESSING_TASKS", "NEED_REPAIR"]
const logsStatus = ["INFO", "WARNING", "ERROR"]

module.exports = {
	
	// default
	responseError: {
		message: { type: 'string' },
	},

	// get tasks
	getTasksResponse: {
		message: { type: 'string' },
		text: { type: 'string' }
	},

	// check ai tasks
	checkAiTasksResponse: {
		message: { type: 'string' },
	},

	// baltazar
	baltazarRequest: {
		message: { type: 'string' },
	},

	// baltazar
	baltazarResponse: {
		message: { type: 'string' },
		text: { type: 'string' },
	},
	
}