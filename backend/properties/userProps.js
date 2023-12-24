const taskTypes = ["LIKE", "RETWEET", "COMMENT", "POST", "DM"]

module.exports = {
	
	// default
	responseError: {
		message: { type: 'string' },
	},

	// authorize
	authorizeRequest: {
		telegram_id: { type: 'number' },
	},

	authorizeResponse: {
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
    telegram_id: { type: 'number' },
		config: { type: 'object', additionalProperties: true }, // todo доделать
		first_name: { type: 'string' },
		last_name: { type: 'string' },
		username: { type: 'string' },
		tg_api: { type: 'string' },
	},

	editResponse: {
		message: { type: 'string' },
		data: { type: 'object', additionalProperties: true },
	},
	
}