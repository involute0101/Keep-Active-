const PgAsync = require('pg-async').default

const Crypt = require('../lib/crypt')
const Time = require('../lib/time')

const _con = require('./con')
const _usr = require('./usr')
const _run = require('./run')
const _loc = require('./loc')

// Database cache
let con, usr, run
exports.make_cache = async () => {
	con = {}, usr = {}, run = {}

	let cons = await _con.all()
	for (let i of cons) {
		con[i.k] = i.v
	}

	let usrs = await _usr.all()
	for (let i of usrs) {
		usr[i.sid] = i
		usr[i.sid].succ = 0
	}

	let runs = await _run.day(Time.ymd())
	for (let i of runs) {
		run[i.rid] = i
		usr[i.sid].succ += i.status == 0
	}
}

exports.init = async () => {
	PR.db = new PgAsync(PR.dbcon)
	await exports.make_cache()
}

exports.con = class {
	static async get(k) {
		return con[k]
	}
	static async set(k, v) {
		let cnt = await _con.set(k, v)
		if (cnt > 0) { con[k] = v }
		return cnt > 0
	}
}

exports.usr = class {
	static async all() {
		return usr
	}
	static async cnt() {
		return await _usr.cnt()
	}
	static async sid(s) {
		if (s in usr) {
			return usr[s]
		}
		return false
	}
	static async clr() {
		let r = await _usr.clr()
		if (Object.keys(usr).length == r) {
			usr = {}
		}
		return r
	}
	static async inc(s, c) {
		if (s in usr) {
			if (await _usr.inc(s, c)) {
				usr[s].cnt += c
				return true
			}
		}
		return false
	}
	static async add(s, n, b, g) {
		if (s in usr) {
			return false
		}
		if (await _usr.add(s, n, b, g)) {
			usr[s] = {
				sid: s, name: n,
				birth: b, sex: g,
				succ: 0
			}
			return true
		}
		return false
	}
	static async del(s) {
		if (s in usr) {
			if (await _usr.del(s)) {
				delete usr[s]
				return true
			}
		}
		return false
	}
}

exports.run = class {
	static async rid(r) {
		if (r in run) {
			return run[r]
		}
		return false
	}
	static async clr() {
		let r = await _run.clr()
		if (Object.keys(run).length == r) {
			run = {}
		}
		return r
	}
	static async cnt() {
		return await _run.cnt()
	}
	static async sum(k) {
		let r = await _run.sum(k)
		if (r[0].sum === null) {
			r[0].sum = 0
		}
		return r[0].sum
	}
	static async usr(s) {
		if (s in usr) {
			return await _run.usr(s)
		}
		return false
	}
	static async set(r, c, d, f, s) {
		let u = run[r].sid
		if (s == 0) { usr[u].succ++ }
		return await _run.set(r, c, d, f, s)
	}
	static async add(s) {
		let r = Crypt.uuid()
		let td = Time.ymd()
		let ts = Time.stamp()
		while (r in run) {
			r = Crypt.uuid()
		}
		if (await _run.add(r, s, td, ts)) {
			run[r] = {
				rid: r, sid: s,
				date: td, time: ts,
				status: -1
			}
			return r
		}
		return false
	}
}

exports.loc = class {
	static async add(r, locs) {
		let cnt = 0
		let it = Time.stamp()
		for (let i of locs) {
			let x = parseFloat(i.x)
			let y = parseFloat(i.y)
			let rt = parseInt(i.t)
			cnt += await _loc.add(r, x, y, rt, it)
		}
		return cnt == locs.length
	}
	static async rid(r) {
		return await _loc.rid(r)
	}
	static async clr() {
		return await _loc.clr()
	}
}

exports.query = async (... args) => {
	return await PR.db.query(... args)
}
