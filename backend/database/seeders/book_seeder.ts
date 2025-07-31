import Book from '#models/book'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class BookSeeder extends BaseSeeder {
  public async run () {
    await Book.createMany([
      { title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', genre: 'Fantasia', year: 1954, isbn: '0000000001' },
      { title: '1984', author: 'George Orwell', genre: 'Distopia', year: 1949, isbn: '0000000002' },
      { title: 'Dom Casmurro', author: 'Machado de Assis', genre: 'Romance', year: 1899, isbn: '0000000003' },
      { title: 'Neuromancer', author: 'William Gibson', genre: 'Cyberpunk', year: 1984, isbn: '0000000004' },
      { title: 'A Revolução dos Bichos', author: 'George Orwell', genre: 'Fábula política', year: 1945, isbn: '0000000005' },
      { title: 'Orgulho e Preconceito', author: 'Jane Austen', genre: 'Romance', year: 1813, isbn: '0000000006' },
      { title: 'Duna', author: 'Frank Herbert', genre: 'Ficção Científica', year: 1965, isbn: '0000000007' },
      { title: 'O Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasia', year: 1937, isbn: '0000000008' },
      { title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', genre: 'Realismo Mágico', year: 1967, isbn: '0000000009' },
      { title: 'O Código Da Vinci', author: 'Dan Brown', genre: 'Suspense', year: 2003, isbn: '0000000010' },
      { title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', genre: 'Fábula', year: 1943, isbn: '0000000011' },
      { title: 'Harry Potter e a Pedra Filosofal', author: 'J.K. Rowling', genre: 'Fantasia', year: 1997, isbn: '0000000012' },
      { title: 'It: A Coisa', author: 'Stephen King', genre: 'Terror', year: 1986, isbn: '0000000013' },
      { title: 'A Menina que Roubava Livros', author: 'Markus Zusak', genre: 'Drama', year: 2005, isbn: '0000000014' },
      { title: 'O Alquimista', author: 'Paulo Coelho', genre: 'Ficção', year: 1988, isbn: '0000000015' },
      { title: 'A Guerra dos Tronos', author: 'George R. R. Martin', genre: 'Fantasia', year: 1996, isbn: '0000000016' },
      { title: 'O Apanhador no Campo de Centeio', author: 'J.D. Salinger', genre: 'Ficção', year: 1951, isbn: '0000000017' },
      { title: 'O Nome do Vento', author: 'Patrick Rothfuss', genre: 'Fantasia', year: 2007, isbn: '0000000018' },
      { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Distopia', year: 1953, isbn: '0000000019' },
      { title: 'Ensaio sobre a Cegueira', author: 'José Saramago', genre: 'Drama', year: 1995, isbn: '0000000020' },
      { title: 'As Crônicas de Nárnia', author: 'C.S. Lewis', genre: 'Fantasia', year: 1950, isbn: '0000000021' },
    ])
  }
}
