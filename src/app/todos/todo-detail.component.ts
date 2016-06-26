import { Component, Input } from '@angular/core';

import { Todo } from './todo';

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
  `]

})
export class TodoDetailComponent {
  @Input()
  todo: Todo;
}
