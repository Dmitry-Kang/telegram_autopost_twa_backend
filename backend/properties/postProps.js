const postStatus = ["PENDING_FOR_GENERATION", "GENERATED", "POSTED", "FAILED"]

module.exports = {
	
	// default
	responseError: {
		message: { type: 'string' },
	},

	// create
  createRequest: {
    channel_id: { type: 'number' },
		time: { type: 'string', format: 'date-time' }
	},

	createResponse: {
		message: { type: 'string' },
		data: { type: 'object', additionalProperties: true },
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

	// edit user
	editRequest: {
    id: { type: 'number' },
    channel_id: { type: 'number' },
		time: { type: 'string', format: 'date-time' },
		text: { type: 'string' },
		photo: { type: 'string' },
		status: { type: 'string', enum: postStatus },
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