import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramComponent } from './program.component';

@NgModule({
  declarations: [ProgramComponent],
  exports: [ProgramComponent],
  imports: [
    CommonModule
  ]
})
export class ProgramModule { }
