import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Todo }           from './todo';
import { Observable }     from 'rxjs/Observable';
import '../rxjs-operators';



@Injectable()
export class TodoService {
  private service_url = 'http://localhost:30000';  // URL to web API
  constructor (private http: Http) {
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get(this.service_url)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  newTodo(): Observable<Todo> {
    return this.http.post(this.service_url, {})
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
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
