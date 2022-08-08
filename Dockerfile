FROM node:16-alpine
WORKDIR /user/src/api

COPY package* ./

RUN npm install


COPY . ./

EXPOSE 8000

CMD ["node","server.js"]