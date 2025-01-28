Utilisation de pm2

npm install -g pm2

pm2 start ./src/index.js --name 'bot'

pm2 list

pm2 startup

pm2 save

pm2 reload Bot

pm2 stop Bot

pm2 logs Bot
