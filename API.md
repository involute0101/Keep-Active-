### 注意事项

1. **管理端 API（所有 url 均为绝对路径，返回的都是 json，如非特别注明发送给服务端数据都以 application/json 或 application/x-www-form-urlencoded 方式编码）**
2. **如果浏览器不支持 cookie，请在所有 login 后续请求的 request 中带上 token（无论是放在 headers 里，还是 url 的 query string 里，还是 application/json、application/x-www-form-urlencoded、multipart/form-data 的请求体中都行）**
3. 如果 token 失效或者未登录情况下访问管理接口，一律返回 `{ err: -1 }`

### APIs

#### 1. `POST /admin/login` 管理员登录

- req
  - pwd 代表管理员密码的字符串
- res
  - err 0代表成功登录，1代表失败，成功情况下会自动让浏览器设置相关 token，前端跳转到管理页即可
  - token 和 Set-Cookie 中相同的 token 值

#### 2. `POST /admin/config` 配置存取

- req
  - 多个键值对的形式，形如 `k1=v1&k2=v2` 或 `{"k1":"v1","k2","v2"}` 这种形式
  - 如果只有键没有值则代表取否则代表存，例如 `k1&k2` 或 `{"k1":"","k2":""}`
  - 多个存取可以在一个接口里完成
- res
  - err 0代表成功 1代表失败
  - data 当取键值时才有该参数，代表取出来的值

```
下面是所有可存取的配置：

管理员密码单独在某个页面中提供修改（无需验证旧密码），修改密码后必须重新登录
('admin', 'admin'), -- admin password
下面是服务器相关设置，非技术人员无需经常改动，可以放在 “其他设置” 中
('minav', '1'), -- minimum Android version 
('miniv', '1'), -- minimum iOS version
('downa', 'path-to-download-android-app'),
('downi', 'path-to-download-ios-app'),
('certfile', '/dev/null'), -- https public certificate
下面是跑步各种要求的设置
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
```

#### 3. `POST /admin/addusr` 用户导入

导入用户的方式分两种，一种是添加单个用户，另一种是表格文件批量导入

添加单个用户，如果该学号已经在库中，会删除原有内容再插入，所以亦可当作是学生信息修改接口

- req
  - sid 学号，如果存在该值，则服务端认定为添加方式为单个用户，不会检测是否有文件上传，请保证后续信息完整性
  - name 学生姓名
  - birth 学生密码（即八位数生日）
  - sex 学生性别，女=0，男=1
- res
  - err 0代表成功 1代表失败

表格文件批量导入，要求是已经执行过清空数据库操作（用户表为空），否则不予导入

- req 请通过 form-data 方式发送文件（multipart/form-data）
  - \* 文件名不限，可以同时上传多个文件，支持解析的文件格式xls/xlsx，一个文件里的多张表多会被解析，对于每张表，第一行必须是表头（姓名、学号、性别、生日），表头排列顺序不限，可以有无关表头存在（不会被解析），请保证上述表头对应的列都有值而不是空，生日格式不限（20000101、2000-01-01、2000年01月01日 都行，但要保证有八个数字），性别处为（男/女）
- res
  - err 0代表成功 1代表用户表非空 2代表文件解析错误/数据库插入错误
  - count 当err=0时有这个值，代表导入学生总数
  - msg 当err=2时有这个值，代表出错信息（上传zip文件可以稳定得到该报错）

#### 4. `POST /admin/clear` 清空数据库

该操作不可逆，请注意让用户确认，会同时删除用户表，跑步成绩记录表，跑步路线记录表

- req 为空，但注意仍然是POST不是GET
- res
  - err 0代表成功，失败的话服务器会直接返回500状态码
  - usr 删除用户数量
  - run 删除跑步成绩条数
  - loc 删除用户位置信息条数

#### 5. `POST /admin/getusr` 查询用户信息

**返回的详细用户数据按照学号从小到大排序**

- req
  - mode 'count'表示只查询个数，'detail'表示查询详细信息
  - sid （可选），查询指定的学号，默认查询所有学号
  - name （可选），查询指定的姓名，默认查询所有姓名
  - limit （可选），限制查询的个数，默认为不限制
  - offset （可选），跳过多少条数据，默认为0（不跳过）
- res
  - err 0代表成功 1代表失败
  - count 当mode='count'有这个值，表示按要求查询到的学生个数
  - detail 当mode='detail'有这个值，json数组，每一个json是一条学生信息（json格式如下）
    - sid 学号
    - name 姓名
    - birth 八位数生日
    - sex 性别

#### 6. `POST /admin/getrun` 查询跑步信息

可以实现查询特定学生所有跑步信息，查询当天、当周、当月跑步次数统计（需要查询多次但比较灵活）等功能

**返回的详细跑步数据按照开始时间从小到大排序**

- req
  - mode 'count'表示只查询次数，'detail'表示查询详细信息
  - type 1表示成功的跑步，2表示失败的跑步，4表示未结束的跑步，三者可以相加
  - sid （可选），查询指定的学号，默认查询所有学生
  - from （可选），查询的起始时间（unix毫秒时间戳），默认为不限起始
  - to （可选），查询的结束时间（unix毫秒时间戳），默认为不限结束
  - limit （可选），限制查询的个数，默认为不限制
  - offset （可选），跳过多少条数据，默认为0（不跳过）
- res
  - err 0代表成功 1代表失败
  - count 当mode='count'有这个值，表示按要求查询到的跑步次数
  - detail 当mode='detail'有这个值，json数组，每一个json是一条跑步信息（json格式如下）
    - rid 跑步的唯一id
    - sid 学号
    - time 开始跑步时的unix毫秒时间戳
    - cost 用时（秒）
    - dist 路程（米）
    - step 步数（Android机型为正数，iOS为负数，取绝对值得到步数）
    - status 结果，-1表示未结束，0表示成功结束成绩有效，11表示路程未达标，12表示用时太少（作弊），13表示超过当日成功跑步的次数限制

#### 7. `POST /admin/getruns` 批量查询跑步次数

可以实现一次性查询当天、当周、当月跑步次数分段统计的功能

- req
  - type 1表示成功的跑步，2表示失败的跑步，4表示未结束的跑步，三者可以相加
  - from 查询的起始时间（unix毫秒时间戳）
  - interval 时间间隔（unix毫秒时间戳）
  - count 段数，最终返回的是一段一段的次数统计
$$
from \to from + 1 \cdot interval \\
from + 1 \cdot interval \to from + 2 \cdot interval \\
\cdots \\
from + (count - 1) \cdot interval \to from + count \cdot interval
$$

- res
  - err 0代表成功 1代表失败
  - data 对象数组，每一个对象是一段的跑步信息（json格式如下）
    - from 这一段的开始unix毫秒时间戳
    - to 这一段的结束unix毫秒时间戳
    - count 这一段的跑步次数统计

#### 8. `POST /admin/getloc` 查询某次跑步的路线

- req
  - rid 待查询的跑步唯一id
- res
  - err 0代表成功 1代表失败
  - data json数组，一个json表示一个点，格式如下
    - lng 经度
    - lat 纬度
    - rec_time 记录时间

#### 9. `POST /admin/addcnt` 成绩导入

导入的方式分两种，一种是为单个用户添加，另一种是表格文件批量导入

为单个用户添加

- req
  - sid 学号，如果存在该值，则服务端认定为单个用户添加
  - cnt 要添加的次数，可以为负数，表示给用户减成绩
- res
  - err 0代表成功 1代表失败（用户不存在）

表格文件批量导入

- req 请通过 form-data 方式发送文件（multipart/form-data）
  - \* 文件名不限，可以同时上传多个文件，支持解析的文件格式xls/xlsx，一个文件里的多张表多会被解析，对于每张表，第一行必须是表头（学号、次数），表头排列顺序不限，可以有无关表头存在（不会被解析），请保证上述表头对应的列都有值而不是空，次数正加负减
- res
  - err 0代表成功 1代表文件解析错误/数据库插入错误
  - count 当err=0时有这个值，代表导入成绩条数
  - msg 当err=1时有这个值，代表出错信息（上传zip文件可以稳定得到该报错）

#### 10. `POST /admin/recent` 获取最近时间的学生位置

- req
  - num 获取个数上限（没有num个人在跑则返回数据不足 num 个）
- req
  - err 0代表成功
  - data 学生数组
    - sid 该学生学号
    - lng 经度
    - lat 纬度
    - time 时间 （最后一次出现的时间）
    - region 区域名字（unknown 代表未知）

#### 11. `GET /admin/result` 下载成绩表格

无参数，建议先缓存到浏览器再让用户下载
