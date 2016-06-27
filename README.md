
# Angular2 RabbitMQ prototype

Angular 2 Rabbit MQ event based prototype. Based on [Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter), [RabbitMQ](), [Docker](), [Docker-Compose]() and [MongoDB]().

It is meant as a prototype to start a discussion about how best incorporate event-driven webapplications into an Angular2 app.

Feel invited to join the discussion. Comments, forks and discussion are very welcome.

### Prerequisits

* Docker and Docker-Compose
* Node.js

### Quickstart

```
# clone the repo
$ git clone https://github.com/rwaldvogel/angular2-rabbitmq.git

# change diretory to the repo
$ cd angular2-rabbitmq

# install dependent modules
$ npm install

# build the docker images
$ docker-compose build
```

This project is meant to be a prototype. So we have to make an ugly patch to Stomp.js: Remove the Node.js dependencies:

```
// EDIT node_modules/stompjs/index.js
// Comment out as shown below

var Stomp = require('./lib/stomp.js');
// var StompNode = require('./lib/stomp-node.js');

module.exports = Stomp.Stomp;
// module.exports.overTCP = StompNode.overTCP;
// module.exports.overWS = StompNode.overWS;
```

So we are ready to the backends:

```
$ docker-compose up
```

And in another terminal start the webapplication:
```
$ npm run server:dev:hmr
```
go to [http://localhost:3000](http://localhost:3000) in your browser. If you are running Chrome consider using 127.0.0.1 instead of localhost

## Running a virtualized Docker-Engine
If you are running Docker in a virtualized environment (like on Windows or Mac). You need to change the server IPs according to the exposed NIC. See

```
$ docker-machine ip
192.168.99.100
```

Adjust `urls.ts` according to your IPs:

```
export const stomp_backend = 'http://192.168.99.100:15674/stomp'
export const micro_service_backend = 'http://192.168.99.100:30000'
```

# RESTful resources with events
RESTful resouces that actively propagate events using RabbitMQ (in this case).

The idea is to combine REST-services with events. Let's start with small example: Todo list.

### Todo list example
So we have the our todos implemented as a microservice with docker.

| Verb	| Route	| Description  	|
|---	|---	|---	|
| GET  	| /   	| returns a list of  todo items  	|
| POST 	| /   	| returns a newly created todo item  	|
| PUT  	| /:id 	| updates an existing todo item  	|
| DELETE| /:id 	| deletes a todo item 	|

So we can do anything we'd like to with todos.

More to come


# License
 [MIT](/LICENSE)
