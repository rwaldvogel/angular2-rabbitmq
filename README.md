
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
git clone https://github.com/rwaldvogel/angular2-rabbitmq.git

# change diretory to the repo
cd angular2-rabbitmq

# install dependent modules
npm install

# start up all required services
docker-compose up
```

go to [http://0.0.0.0:3000](http://0.0.0.0:3000) or [http://localhost:3000](http://localhost:3000) in your browser.

### Running a virtualized Docker-Engine
If you are running Docker in a virtualized environment (like on Windows or Mac). You need to change the server IPs according to the exposed NIC. See

> docker-machine ip

# REVENTful resources
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



## File Structure
We use the component approach in our starter. This is the new standard for developing Angular apps and a great way to ensure maintainable code by encapsulation of our behavior logic. A component is basically a self contained app usually in a single file or a folder with each concern as a file: style, template, specs, e2e, and component class. Here's how it looks:
```
angular2-webpack-starter/
 ├──config/                    * our configuration
 |   ├──helpers.js             * helper functions for our configuration files
 |   ├──spec-bundle.js         * ignore this magic that sets up our angular 2 testing environment
 |   ├──karma.conf.js          * karma config for our unit tests
 |   ├──protractor.conf.js     * protractor config for our end-to-end tests
 │   ├──webpack.dev.js         * our development webpack config
 │   ├──webpack.prod.js        * our production webpack config
 │   └──webpack.test.js        * our testing webpack config
 │
 ├──src/                       * our source files that will be compiled to javascript
 |   ├──main.browser.ts        * our entry file for our browser environment
 │   │
 |   ├──index.html             * Index.html: where we generate our index page
 │   │
 |   ├──polyfills.ts           * our polyfills file
 │   │
 |   ├──vendor.ts              * our vendor file
 │   │
 │   ├──app/                   * WebApp: folder
 │   │   ├──app.spec.ts        * a simple test of components in app.ts
 │   │   ├──app.e2e.ts         * a simple end-to-end test for /
 │   │   └──app.ts             * App.ts: a simple version of our App component components
 │   │
 │   └──assets/                * static assets are served here
 │       ├──icon/              * our list of icons from www.favicon-generator.org
 │       ├──service-worker.js  * ignore this. Web App service worker that's not complete yet
 │       ├──robots.txt         * for search engines to crawl your website
 │       └──human.txt          * for humans to know who the developers are
 │
 │
 ├──tslint.json                * typescript lint config
 ├──typedoc.json               * typescript documentation generator
 ├──tsconfig.json              * config that webpack uses for typescript
 ├──typings.json               * our typings manager
 ├──package.json               * what npm uses to manage it's dependencies
 └──webpack.config.js          * webpack main configuration file

```

# License
 [MIT](/LICENSE)
