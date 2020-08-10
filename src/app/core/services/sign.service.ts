import { Injectable } from '@angular/core';
declare var bodymovin: any;
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SignService {
  check: any;
  check2: any;

  constructor() { }

  openSign() {
    $('#sign').modal('show');
  }

  closeSign() {
    $('#sign').modal('toggle');
  }

  acceptSign() {
    $('#sign').modal('toggle');
    this.check = 1;
  }

  acceptCheckService() {
    if(this.check == 1) {
      this.check = 0;
    } else if(this.check != 1) {
      this.check = 1;
    }
  }

  acceptCheckService2() {
    if(this.check2 == 1) {
      this.check2 = 0;
    } else if(this.check2 != 1) {
      this.check2 = 1;
    }
  }

  openUnderstood() {
    $('#understood').modal('show');
  }

  closeUnderstood() {
    $('#understood').modal('toggle');
  }
}