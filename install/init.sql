-- You should run this script with PostgreSQL

DROP TABLE IF EXISTS con;
CREATE TABLE con (
	k text NOT NULL,
	v text NOT NULL,
	CONSTRAINT con_k PRIMARY KEY (k)
);

DROP TABLE IF EXISTS usr;
CREATE TABLE usr (
	sid text NOT NULL,
	name text NOT NULL,
	birth text NOT NULL,
	sex boolean NOT NULL,
	cnt integer DEFAULT 0 NOT NULL,
	CONSTRAINT usr_sid PRIMARY KEY (sid)
);

DROP TABLE IF EXISTS run;
CREATE TABLE run (
	rid text NOT NULL,
	sid text NOT NULL,
	date text NOT NULL,
	time bigint NOT NULL,
	cost integer DEFAULT 0 NOT NULL,
	dist integer DEFAULT 0 NOT NULL,
	step integer DEFAULT 0 NOT NULL,
	status integer DEFAULT -1 NOT NULL,
	CONSTRAINT run_rid PRIMARY KEY (rid)
);
CREATE INDEX run_sid ON run (sid);

DROP TABLE IF EXISTS loc;
CREATE TABLE loc (
	rid text NOT NULL,
	lng numeric NOT NULL,
	lat numeric NOT NULL,
	rec_time bigint NOT NULL,
	ins_time bigint NOT NULL
);

INSERT INTO usr VALUES
('100', '测试女', '10000000', false, 0),
('101', '测试男', '10000000', true, 0);

INSERT INTO con VALUES
('admin', 'admin'), -- admin password
('minav', '1'), -- minimum Android version 
('miniv', '1'), -- minimum iOS version
('downa', 'path-to-download-android-app'),
('downi', 'path-to-download-ios-app'),
('certfile', '/dev/null'), -- https public certificate
('stime', '946656000000'), -- 2000-01-01 00:00:00 (start time)
('etime', '32503651200000'), -- 3000-01-01 00:00:00 (end time)
('wdist', '100'), -- girl running distance
('mdist', '200'), -- boy running distance
('goal', '100'),
('mint', '5'), -- minimum time (s)
('maxt', '60'), -- maximum time (s)
('mins', '0'), -- minimum speed (m/s)
('maxs', '10'), -- maximum speed (m/s)
('mina', '0'), -- minimum accuracy (m)
('maxa', '50'), -- maximum accuracy (m)
('count', '1'),
('continue', '1'),
('period', '281474976710655'),
('region', '[{
	"name": "地球",
	"shape": [
		[180, 180], [180, -180],
		[-180, -180], [-180, 180]
	]
}]');
