# expects a firewall rule opening port 27018 to application servers
source .env

# Setup database directory
sudo mkdir -p /data/db
sudo chmod -R 757 /data/db

# Stop an existing mongo instance
pgrep mongod | xargs kill -2
sleep 1

# Create admin user
mongod --port 27017 --dbpath /data/db --fork --logpath /usr/local/var/log/mongodb/mongod.log
mongo localhost:27017/admin --eval "db.createUser({user:'$DB_ADMIN_USER',pwd:'$DB_ADMIN_PASSWORD',roles:[{role:'userAdminAnyDatabase',db:'admin'}, 'readWriteAnyDatabase']})"

# Install TLS certificate, configure mongo to use it
cd /etc/ssl/
sudo openssl req -newkey rsa:2048 -new -x509 -days 365 -nodes -out mongodb-cert.crt -keyout mongodb-cert.key -subj "/C=US/ST=California/L=San Francisco/O=helloGov/OU=Engineering/CN=data.hellogov.org"
sudo sh -c "cat mongodb-cert.key mongodb-cert.crt > mongodb.pem"
sudo scp mongodb.pem /tmp/mongodb.pem
sudo cp -r "$LOCAL_DIR/conf/mongod.conf" /etc

# Stop an existing mongo instance
pgrep mongod | xargs kill -2
sleep 1

# Test secure connection and create standard db user
mongod --config /etc/mongod.conf --auth --port 27017 --dbpath /data/db --fork --logpath /usr/local/var/log/mongodb/mongod.log
mongo localhost:27017/hellogov -u $DB_ADMIN_USER -p $DB_ADMIN_PASSWORD --authenticationDatabase "admin" --ssl --sslAllowInvalidHostnames --sslCAFile /etc/ssl/mongodb.pem --eval "db.createUser({user:'$DB_USER',pwd:'$DB_PASSWORD',roles:[{role:'readWrite',db:'hellogov'}]});"
