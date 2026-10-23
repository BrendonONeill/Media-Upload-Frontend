FROM node:24.22.1-alpine3.24

WORKDIR /app

COPY . .

RUN npm install

CMD [ "node", "src/index.js" ]
