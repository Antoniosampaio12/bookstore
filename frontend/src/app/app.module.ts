import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { BooksListComponent } from './books/components/books-list/books-list.component';
import { BookDetailComponent } from './books/components/book-detail/book-detail.component';
import { BookFormComponent } from './books/components/book-form/book-form.component';
import { ChartsComponent } from './books/components/charts/charts.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { DateFormatPipe } from './shared/pipes/date-format.pipe';
import { HighlightDirective } from './shared/directives/highlight.directive';
import { provideHttpClient } from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    BooksListComponent,
    BookDetailComponent,
    BookFormComponent,
    ChartsComponent,
    LoadingSpinnerComponent,
    DateFormatPipe,
    HighlightDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
