import { Component, Input } from '@angular/core';

import { Todo } from './todo';
import { GUID } from '../utils';
import { TodoService } from './todos.service';
import { InitiatorService } from '../initiator.service'
import { stomp_backend } from '../urls';


@Component({
  selector: 'todo-detail',
  template: `
    <div *ngIf="todo" class="todo-detail">
      {{todo.item}}
      <br>
      Erledigt: {{todo.done}}
    </div>`
  ,
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
  }

}
