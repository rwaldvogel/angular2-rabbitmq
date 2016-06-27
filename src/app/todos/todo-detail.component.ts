import { Component, Input } from '@angular/core';

import { Todo } from './todo';
import { GUID } from '../utils';
import { TodoService } from './todos.service';
import { InitiatorService } from '../initiator.service'
import { stomp_backend } from '../urls';

var Stomp = require('stompjs');
var SockJS = require('sockjs-client');


@Component({
  selector: 'todo-detail',
  template: `
    <div *ngIf="todo" class="todo-detail">
      <div>{{todo.item}}</div>
      <div>Erledigt: {{todo.done}}</div>
    </div>`
  ,
  styles: [`
    .todo-detail {
      margin-top: 4px;
      border-bottom: solid 1px;
    }
  `],
  providers: [TodoService]

})
export class TodoDetailComponent {
  @Input()
  todo: Todo;
  client: any;

  constructor(private service: TodoService, private iid: InitiatorService )
  {
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
              }
              else {
              }
            }
            else
            {
            }
      };
      console.log("before subscription");
      this.subscription = clt.subscribe("/topic/todo" + self.todo._id, callback);
      console.log("after subscription");
    };
    var on_error =  function() {
       console.log('error');
    };
    this.client = clt;
    this.client.connect('guest', 'guest', on_connect, on_error, '/');
  }

}
