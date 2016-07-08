import { Component, Input } from '@angular/core';
import { Todo } from './todo';
import { TodoService } from './todos.service';
import { InitiatorService } from '../initiator.service';
import { stomp_backend } from '../urls';

declare var Paho;

@Component({
  selector: 'todo-edit',
  templateUrl: 'todo-edit.template.html',
  styles: [`
    .todo-edit-container {
      margin: 4px;
      border: solid 1px;
    }
  `]
})
export class TodoEditComponent {
  @Input()
  todo: Todo;
  client: any;
  error: any;

  constructor(private service: TodoService, private iid: InitiatorService)
  {
  }

  private connectViaMQTT()
  {
    // Create a client instance
    let client = new Paho.MQTT.Client('127.0.0.1', Number(9001), this.iid.getIID()+"edit" );
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
      client.subscribe("/todos/"+self.todo._id);
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
      }
    }

    // called when a message arrives
    function onMessageArrived(message) {
      console.log("TodoEditComponent: onMessageArrived:"+message.payloadString);
      let payload = JSON.parse(message.payloadString)
      console.log("iid" + self.iid.getIID());
      console.log(message.initiator != self.iid.getIID()+"edit");
      console.log(message.initiator);
      if( payload.initiator != self.iid.getIID()+"edit" )
      {
        console.log("reloading data");
        self.loadTodo();
      }
    }
  }


  ngOnInit() {
  }

  ngOnChanges() {
    if( this.todo )
    {
      this.connectViaMQTT();
    }
  }
  onUpdate()
  {
    console.log("Update");
    this.service.updateTodo( this.todo ).subscribe();
  }

  loadTodo()
  {
      this.service.getTodo(this.todo._id).subscribe(
        todo => {
          let dbg: any;
          dbg = todo;
          console.debug(dbg);
          this.todo = todo;
        },
        error => this.error = error
      );
  }
}
