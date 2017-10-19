export class User {
    constructor(public username: string,
      public password: string,
      public remember: boolean = false,
      private role: any = 'none') {}
    }