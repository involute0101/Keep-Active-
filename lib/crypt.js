const {
	createHash, randomBytes,
	createCipher, createDecipher
} = require('crypto')
const Time = require('./time')
const {readFileSync} = require('fs')
const {util, pki, asn1, md} = require('node-forge')

const md5 = str => createHash('md5').update(str).digest('hex')
const sha1 = str => createHash('sha1').update(str).digest('hex')
const rands = len => randomBytes(len).toString('hex').substr(0, len)
const chash = (p, m, s) => md5(`${p}${m}${s}`)

const hash = pem => {
	let cert, asn, bytes, hash
	cert = pki.certificateFromPem(pem)
	asn = pki.certificateToAsn1(cert)
	bytes = asn1.toDer(asn).getBytes()
	hash = md.sha1.create().update(bytes).digest()
	bytes = util.hexToBytes(hash.toHex())
	hash = md.md5.create().update(bytes).digest()
	return hash.toHex()
}

const vt = sid => md5(`$${sid}$`)
const vp = sid => vt(sid).substr(0, 16)
const vs = sid => vt(sid).substr(15, 16)
const vv = s => chash(vp(s), PR.vh, vs(s))

let pwd = '' // password for cryption

exports.encrypt = str => {
	try {
		let cipher = createCipher('aes-256-cfb', pwd)
		let res = cipher.update(str, 'utf8', 'hex')
		return res + cipher.final('hex')
	} catch(e) {
		return false
	}
}
exports.decrypt = str => {
	try {
		let decipher = createDecipher('aes-256-cfb', pwd)
		let res = decipher.update(str, 'hex', 'utf8')
		return res + decipher.final('utf8')
	} catch(e) {
		return false
	}
}

exports.vs = vs
exports.vp = vp
exports.vv = vv
exports.md5 = md5
exports.sha1 = sha1
exports.chash = chash
exports.uuid = () => rands(24)

exports.init = async () => {
	let f = await PRD.con.get('certfile')
	let pem = readFileSync(f)
	let s = PR.vh = hash(pem)
	let d = sha1(Time.ymd())
	pwd = `${d}-PR-KEY-${s}`
}
