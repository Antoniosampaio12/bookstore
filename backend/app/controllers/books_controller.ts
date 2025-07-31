import Book from '#models/book'
import { bookValidator } from '#validators/book'
import type { HttpContext } from '@adonisjs/core/http'

export default class BooksController {
  /**
   Listar os livros
   */
  async index({ request }: HttpContext) {
    //extrai da QueryString os filtros opcionais e parametros de paginação
    const {title, author, genre, page = 1, limit = 10} = request.qs()
    //consulta na tabela books
    const query = Book.query()
    //adiciona os filtros de texto
    if (title) query.whereILike('title', `%${title}%`)
    if (author) query.whereILike('author', `%${author}%`)
    if (genre) query.whereILike('genre', `%${genre}%`)
    //paginacao do lucid ORM
    return await query.paginate(page, limit)

  }

  /**
   * Criar um livro
   */
  async store({ request }: HttpContext) {
    //Valida os dados enviados na requisição
    const data = await request.validateUsing(bookValidator())
    //cria e salva o livro no banco
    return await Book.create(data)
  }

  /**
   * Exibir umlivro especifico
   */
  async show({ params }: HttpContext) {
    //mostar um livro baseado em seu id
    return await Book.findOrFail(params.id)
  }

  /**
   * Atualizar livro especifico
   */
  async update({ params, request }: HttpContext) {
    // encontra um livro pelo id
    const book = await Book.findOrFail(params.id)
    // valida os dados enviados na requisição
    // passa o id do livro atual para verificar o 'isbn' e ignora-lo 
    const data = await request.validateUsing(bookValidator(book.id))
    // mescla os dados com os dados do livro encontrado
    book.merge(data)
    //salva o estado atual do livro
    await book.save()
    //mostra o livro atualizado
    return book
  }

  /**
   * Deletar um livro especifico
   */
  async destroy({ params }: HttpContext) {
    //encontro o livro pelo id
    const book = await Book.findOrFail(params.id)
    //deleto o livro no banco
    book.delete()

    return { message: 'Livro deletado com sucesso'}
  }

}