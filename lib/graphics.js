// point in polygon
exports.pip = (x, y, p) => {
	let flag = false
	let i = 0, j = p.length - 1
	while (i < p.length) {
		let sx = p[i][0],
			sy = p[i][1],
			tx = p[j][0],
			ty = p[j][1]
		if (x == sx && y == sy) { return true }
		if (x == tx && y == ty) { return true }
		if ((sy < y && ty >= y) || (sy >= y && ty < y)) {
			let _x = sx + (y - sy) * (tx - sx) / (ty - sy)
			if (x === _x) { return true }
			if (x < _x) { flag = !flag }
		}
		j = i++
	}
	return flag
}
