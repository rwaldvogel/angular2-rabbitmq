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

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');

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

  ngOnInit() {
    console.debug("starting stomp");
    Stomp.WebSocketClass = SockJS;

    let clt = Stomp.client(stomp_backend);
    clt.heartbeat.incoming = 0;
    clt.heartbeat.outgoing = 0;
    // Scoping this for closure
    let self = this;
    var on_connect = function() {
        console.log('connected');
        var callback = function(message) {
            // called when the client receives a STOMP message from the server
            let initiator;
            if (message.body)
            {
              let p = JSON.parse(message.body);
              let initiator = p.initiator;
              if(initiator == self.iid.getIID()) {
                self.loadTodos();
              }
              else {
                // self.changed = true;
                self.loadTodos();
              }
            }
            else
            {
            }
      };
      console.log("before subscription");
      this.subscription = clt.subscribe("/topic/todos", callback);
      console.log("after subscription");
    };
    var on_error =  function() {
       console.log('error');
    };
    this.client = clt;
    this.client.connect('guest', 'guest', on_connect, on_error, '/');
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
