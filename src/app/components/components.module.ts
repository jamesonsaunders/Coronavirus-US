import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsMapComponent } from './us-map/us-map.component';



@NgModule({
  declarations: [
    UsMapComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    UsMapComponent,
  ],
})
export class ComponentsModule { }
