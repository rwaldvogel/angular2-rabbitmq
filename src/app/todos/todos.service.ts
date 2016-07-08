import { Injectable }     from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Todo }           from './todo';
import { Observable }     from 'rxjs/Observable';
import { InitiatorService } from '../initiator.service';
import { micro_service_backend } from '../urls';
import '../rxjs-operators';
import '../utils';

@Injectable()
export class TodoService {
  private service_url = micro_service_backend;  // URL to web API
  constructor (private http: Http, private iid: InitiatorService) {
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get(this.service_url)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getTodo(id: String): Observable<Todo> {
    return this.http.get(this.service_url + "/" + id)
                    .map(this.extractTodo)
                    .catch(this.handleError);
  }

  newTodo(): Observable<Todo> {
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let payload = JSON.stringify({initiator: this.iid.getIID(),
        data:{item: "New item", done: false}});
    return this.http.post(this.service_url, payload, {headers: headers} )
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  updateTodo( todo: Todo ): Observable<Todo> {
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let payload = JSON.stringify({initiator: this.iid.getIID(),
        data: {item: todo.item, done: todo.done}});
    console.debug(payload);
    return this.http.put(this.service_url + "/" + todo._id, payload, {headers: headers} )
                    .map(this.extractData)
                    .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json();
    console.debug( "extractData" );
    console.debug(body);
    return body.data || { };
  }

  private extractTodo(res: Response) {
    let body = res.json();
    console.debug( "extractData" );
    console.debug(body);
    return body.data || { };
  }


  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
