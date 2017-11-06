import { Injectable } from '@angular/core';
import { Headers, Http, URLSearchParams, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ApiProvider {
  private url = 'http://iterius.com/api/';
  constructor(public http: Http) {
    console.log('Hello ApiProvider ');
  }

  login(req) {
    console.log('Request to api', req);
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new URLSearchParams();

    body.set("model[password]", req.password);
    body.set("model[username]", req.username);
    body.set("model[remember]", req.remember || false);

    return this.http.post(this.url + 'login', body.toString(), options)
  }
  requestTasks(id) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new URLSearchParams();
    return !id ? this.http.post(this.url + 'tasks', null)
      //.subscribe((event: Response) => console.log(event))
      : this.userWithId(headers, options, body, id)
    //.subscribe((event: Response) => console.log(event));
  }
  userWithId(head, opts, body, id) {
    body.set("user", id);
    return this.http.post(this.url + 'tasks', body, opts)
  }
  toggleState(id) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new URLSearchParams();

    body.set("id", id);
    return this.http.post(this.url + 'toggle', body.toString(), options)
      // .subscribe((event: Response) => console.log(event));
  }
  // this.TaskCreate = function (object) {//createTask.TaskCreate to APIService.TaskCreate

  //   // console.log(req);
  //   return $http({
  //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //     method: 'POST',
  //     data: $httpParamSerializerJQLike({
  //       title: object.title,
  //       description: object.description,
  //       task_id: object.id || undefined,
  //       user_id: object.assigned || undefined
  //     }),
  //     url: url + 'createTask'
  //   })
  // };
  requestStatistic(obj) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new URLSearchParams();
    return !obj
      ? this.http.post(this.url + 'Statistic', null)

      : this.userStatId(headers, options, body, obj)

  }
  userStatId(head, opts, body, obj) {
    body.set("user", obj.user);
    body.set("year", obj.year);
    body.set("month", obj.month);
    return this.http.post(this.url + 'Statistic', body, opts)
  }

  // };
  // this.logout = function () {
  //   return $http({
  //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //     method: 'POST',
  //     data: $httpParamSerializerJQLike({
  //       //data
  //     }),
  //     url: url + 'logout'
  //   })
  // };
  teamStatus() {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new URLSearchParams();

    // body.set("id", id);
    return this.http.post(this.url + 'teamStatus', body.toString(), options)
      // .subscribe((event: Response) => console.log(event));
  }
  taskUpdate(obj) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new URLSearchParams();

    body.set("id", obj.id);
    return this.http.post(this.url + 'getTaskModel', body.toString(), options)
      // .subscribe((event: Response) => console.log(event));
  }
  taskDelete(obj) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new URLSearchParams();

    body.set("id", obj.id);
    return this.http.post(this.url + 'deleteTask', body.toString(), options)
      // .subscribe((event: Response) => console.log(event));
  }
}


