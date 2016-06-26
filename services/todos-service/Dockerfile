FROM node:6

RUN mkdir /service
WORKDIR /service

COPY *.json ./
RUN npm install

COPY *.js ./

EXPOSE 3000

CMD node server.js