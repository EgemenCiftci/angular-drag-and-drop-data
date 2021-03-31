import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, CardComponent, DragAndDropComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
