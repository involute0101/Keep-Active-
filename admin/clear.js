module.exports = async ctx => {
	if (!ctx.valid) {
		ctx.body = { err: -1 }
		return 'invalid token'
	}

	ctx.body = {
		err: 0,
		usr: await PRD.usr.clr(),
		run: await PRD.run.clr(),
		loc: await PRD.loc.clr()
	}
}
