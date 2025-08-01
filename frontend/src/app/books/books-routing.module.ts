// src/app/books/books-routing.module.ts
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BooksListComponent } from './components/books-list/books-list.component'
import { BookDetailComponent } from './components/book-detail/book-detail.component'
import { BookFormComponent } from './components/book-form/book-form.component'
import { ChartsComponent } from './components/charts/charts.component'

const routes: Routes = [
  { path: '', component: BooksListComponent },
  { path: 'create', component: BookFormComponent },
  { path: 'edit/:id', component: BookFormComponent },
  { path: 'charts', component: ChartsComponent },
  { path: ':id', component: BookDetailComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
