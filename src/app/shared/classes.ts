export class User {
    constructor(public username: string,
      public password: string,
      public remember: boolean = false,
      private role: any = 'none') {}
    }
    export class Task {
      constructor(
        public id:String,
        public name:String,
        public time:number,
        public description:string,
        public current:boolean
      ){}
    }