// src/app/books/books.module.ts
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BooksRoutingModule } from './books-routing.module'
import { BooksListComponent } from './components/books-list/books-list.component'
import { BookDetailComponent } from './components/book-detail/book-detail.component'
import { BookFormComponent } from './components/book-form/book-form.component'
import { ChartsComponent } from './components/charts/charts.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    BooksListComponent,
    BookDetailComponent,
    BookFormComponent,
    ChartsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BooksRoutingModule
  ]
})
export class BooksModule {}
