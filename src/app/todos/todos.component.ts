import { Component } from '@angular/core';
import { Todo } from './todo';
import { AppState } from '../app.service';
import { TodoService } from './todos.service';
import { Observable } from 'rxjs/Observable';
import { InitiatorService } from '../initiator.service';
import { stomp_backend } from '../urls';
import { TodoDetailComponent } from './todo-detail.component';
import { TodoEditComponent } from './todo-edit.component';
import { Dragula, DragulaService } from 'ng2-dragula/ng2-dragula';

// var Stomp = require('stompjs');
// var SockJS = require('sockjs-client');
declare var Paho;


@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    TodoService
  ],
  // We need to tell Angular's compiler which directives are in our template.
  // Doing so will allow Angular to attach our behavior to an element
  directives: [TodoDetailComponent, Dragula, TodoEditComponent],
  viewProviders: [DragulaService],
  // We need to tell Angular's compiler which custom pipes are in our template.
  pipes: [ ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './todos.style.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './todos.template.html'
})
export class TodosComponent {
  // Set our default values
  localState = { value: '' };
  todos: Todo[];
  todos_done: Todo[]
  todo: Todo;
  error: any;
  client : any;
  subscription : any;
  changed: boolean = false;
  selectedTodo: Todo;

  // TypeScript public modifiers
  constructor(public appState: AppState, private service: TodoService, private iid: InitiatorService) {
  }


  private connectViaMQTT()
  {
    // Create a client instance
    let client = new Paho.MQTT.Client('127.0.0.1', Number(9001), this.iid.getIID() );
    var self = this;
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect, userName:'guest', password: 'guest'});


    // called when the client connects
    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log("onConnect");
      client.subscribe("/todos/#");
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
      }
    }

    // called when a message arrives
    function onMessageArrived(message) {
      console.log("onMessageArrived:"+message.payloadString);
      let payload = JSON.parse(message.payloadString)
      console.log("iid" + self.iid.getIID());
      console.log(message.initiator != self.iid.getIID());
      console.log(message.initiator);
      if( payload.initiator != self.iid.getIID() )
      {
        console.log("reloading data");
        self.loadTodos();
      }
    }
  }
  ngOnInit() {
    console.debug("starting MQTT");
    this.connectViaMQTT();
    this.loadTodos();
  }

  onNewTodo()
  {
    this.service.newTodo().subscribe(
      todo => {
        let dbg: any;
        dbg = todo;
        console.debug(dbg);
        this.todo = todo;
      },
      error => this.error = error
    );
  }
  onReloadTodos()
  {
    this.loadTodos();
    this.changed = false;
  }

  onSelect( todo: Todo )
  {
    this.selectedTodo = todo;
  }

  onUpdateSelected()
  {
    this.service.updateTodo(this.selectedTodo).subscribe(
      todo => {
        let dbg: any;
        dbg = todo;
        console.debug(dbg);
        this.todo = todo;
      },
      error => this.error = error
    );
  }

  private loadTodos()
  {
    this.service.getTodos().subscribe(
      todos => {
        let dbg: any;
        dbg = todos;
        console.debug(dbg);
        this.todos = todos;
      },
      error => this.error = error
    );
  }
}
