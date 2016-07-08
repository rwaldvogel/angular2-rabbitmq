var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var promise = require('bluebird');

var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://mosquitto', {username: 'guest', password: 'guest', clientId: 'mongodb'});

var options = { promiseLibrary: require('bluebird') };
client.on('connect', function () {
  console.log("mqtt connected to rabbitmq")
});


var TodoSchema = new mongoose.Schema({
    item: { type: String, default: "" },
    description: {type: String, default: ""},
    done: { type: Boolean, default: false },
    updated_at: { type: Date, default: Date.now },
});

var options = { promiseLibrary: require('bluebird') };
mongoose.connect('mongodb://mongodb:27017/rabbit-mq-todo', options);
var Todo = mongoose.model('Todo', TodoSchema)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Get one todo item
app.get('/:id', function (req, res, next) {
    Todo.findById(req.params.id)
        .then(function(todo) {
            res.json({data: todo});
        })
        .catch(function(err) {
            res.send(err);
        })
});

// Get all todos
app.get('/', function (req, res, next) {
    Todo.find()
        .then(function(todo) {
            res.json({data: todo});
        })
        .catch(function(err) {
            res.send(err);
        })
});

// Get all todos
app.post('/', function (req, res, next) {
    console.log("got post");
    console.log(req.body);
    var iid = req.body.initiator
    Todo.create(req.body.data)
        .then(function(todo) {
            console.log("created new todo")
            payload = {data: todo, initiator: iid};
            console.log(payload);
            res.json({data: todo});
            var msg = new Buffer(JSON.stringify(payload));
            client.publish('/todos', msg);
            next();
        })
        .catch(function(err) {
            res.send(err);
        });
});

// update todo
app.put('/:id', function (req, res, next) {
    console.log("PUT " + req.params.id);
    console.log(req.body);
    var iid = req.body.initiator
    Todo.findByIdAndUpdate(req.params.id, req.body.data, {new: true}).
        then(function(todo) {
          payload = {data: todo, initiator: iid};
          console.log(payload);
          var msg = new Buffer(JSON.stringify(payload));
          client.publish('/todos/' + todo.id, msg);
          res.json({data: todo});
        })
        .catch(function(err) {
            res.send(err);
        });
});

// delete todo
app.delete('/:id', function (req, res, next) {
    Todo.findByIdAndRemove(req.params.id, req.body.data).
        then(function(todo) {
            res.json({data: todo});
        })
        .catch(function(err) {
            res.send(err);
        });
});


app.listen(3000)
