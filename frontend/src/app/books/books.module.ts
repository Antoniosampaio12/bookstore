import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { BooksRoutingModule } from './books-routing.module';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BookFormComponent } from './components/book-form/book-form.component';

@NgModule({
  declarations: [
    BookListComponent,
    BookDetailComponent,
    BookFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BooksRoutingModule
  ]
})
export class BooksModule { }