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
  // this.requestTasks = function () {//taskService.requestData заменить на APIService.requestTasks
  //   // console.log(req);
  //   return $http({
  //     method: 'POST',
  //     url: url + 'tasks'
  //   });
  // };
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
  // this.toggleState = function (id) {//taskToggle.toggleState to APIService.toggleState
  //   return $http({
  //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //     method: 'POST',
  //     data: $httpParamSerializerJQLike({id: id}),
  //     // permissions: ['http://172.16.3.141/'],
  //     url: url + 'toggle'
  //   })
  // };
  toggleState(id) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*'
    });
    let options = new RequestOptions({ headers: headers });
    let body = new URLSearchParams();

    body.set("id", id);
    this.http.post(this.url + 'tasks', body.toString(), options)
      .subscribe((event: Response) => console.log(event));
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
  // this.Statistic = function (obj) {
  //   console.log(obj);
  //   if (!obj) {
  //     return $http({
  //       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //       method: 'POST',
  //       data: $httpParamSerializerJQLike({}),
  //       url: url + 'Statistic'
  //     })
  //   } else {
  //     return $http({
  //       headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //       method: 'POST',
  //       data: $httpParamSerializerJQLike({
  //         user: obj.user,
  //         year: obj.year,
  //         month: obj.month
  //       }),
  //       url: url + 'Statistic'
  //     })
  //   }

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
  // this.teamStatus = function () {
  //   return $http({
  //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //     method: 'POST',
  //     data: $httpParamSerializerJQLike({
  //       //data
  //     }),
  //     url: url + 'teamStatus'
  //   })
  // };

  // this.TaskUpdate = function (object) {//createTask.TaskCreate to APIService.TaskCreate

  //   // console.log(req);
  //   return $http({
  //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //     method: 'POST',
  //     data: $httpParamSerializerJQLike({
  //       id: object.id
  //     }),
  //     url: url + 'getTaskModel'
  //   })
  // };
  // this.TaskDelete = function (object) {//createTask.TaskCreate to APIService.TaskCreate

  //   // console.log(req);
  //   return $http({
  //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //     method: 'POST',
  //     data: $httpParamSerializerJQLike({
  //       id: object.id
  //     }),
  //     url: url + 'deleteTask'
  //   })
  // };
}


