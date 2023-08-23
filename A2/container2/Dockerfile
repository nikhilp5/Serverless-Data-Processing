FROM node:18
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm test server.test.js
EXPOSE 3002
CMD [ "node", "server.js" ]
