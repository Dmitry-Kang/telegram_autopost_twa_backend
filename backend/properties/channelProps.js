const healthStatus = ["HEALTHY", "WARNING", "CRITICAL"]
const statusReason = ["CANT_SEND_POSTS", "CHANNEL_NOT_FOUND"]

module.exports = {
	
	// default
	responseError: {
		message: { type: 'string' },
	},

	// create
  createRequest: {
    user_id: { type: 'number' },
    channel_name: { type: 'string' },
    channel_id: { type: 'number' },
	},

	createResponse: {
		message: { type: 'string' },
		data: { type: 'array', items: { type: 'object', additionalProperties: true }}, // todo доделать
	},

	// get all
	getAllResponse: {
		message: { type: 'string' },
		data: { type: 'array', items: { type: 'object', additionalProperties: true }}, // todo доделать
	},

  // get one
	getOneResponse: {
		message: { type: 'string' },
		data: { type: 'object', additionalProperties: true }, // todo доделать
	},

	// edit
	editRequest: {
    id: { type: 'number' },
		channel_name: { type: 'string' },
		channel_id: { type: 'number' },
		username: { type: 'string' },
		config: { type: 'object', additionalProperties: true },
    status: { type: 'string', enum: healthStatus },
    reason: { type: 'string', enum: statusReason },
	},

	editResponse: {
		message: { type: 'string' },
		data: { type: 'object', additionalProperties: true },
	},

  // delete
	deleteResponse: {
		message: { type: 'string' },
		data: { type: 'object', additionalProperties: true },
	},
	
}