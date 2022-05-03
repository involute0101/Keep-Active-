cd `dirname $0`

echo -n 'Postgres user: '
read user
echo -n 'Database name: '
read name
echo "CREATE DATABASE $name;" | psql -U $user
psql -U $user -d $name < init.sql
echo "{
	\"user\": \"$user\",
	\"database\": \"prun\"
}" > ../config.json
