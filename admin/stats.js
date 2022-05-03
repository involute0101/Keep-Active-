module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	ctx.body = {
		err: 0,
		sum: {
			step: await PRD.run.sum('step'),
			dist: await PRD.run.sum('dist')
		}
	}
}
