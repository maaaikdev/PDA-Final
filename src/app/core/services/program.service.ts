import { Injectable } from '@angular/core';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  program: any;
  constructor() { }

  open(data: any) {
    this.program = data;
    $('#modal-program').modal('show');
  }
}
