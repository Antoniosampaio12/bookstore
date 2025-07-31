import Book from '#models/book'
import { bookValidator } from '#validators/book'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class BooksController {
  /**
   Listar os livros
   */
  async index({ request }: HttpContext) {
    //extrai da QueryString os filtros opcionais e parametros de paginação
    const {title, author, genre, page = 1, limit = 10} = request.qs()

    //chave do cache com base nos filtros, representa a consulta
    const cacheKey = `books:${title}:${author}:${genre}:page${page}:limit${limit}`
    //tenta recuperar do cache
    const cached = await redis.get(cacheKey)
    if (cached){
      //console.log(' Respondendo do cache Redis')
      return JSON.parse(cached)
    }

    //se não estiver no cache, faz busca no banco
    //consulta na tabela books
    const query = Book.query()
    //adiciona os filtros de texto
    if (title) query.whereILike('title', `%${title}%`)
    if (author) query.whereILike('author', `%${author}%`)
    if (genre) query.whereILike('genre', `%${genre}%`)
    //paginacao do lucid ORM
    //console.log(' Buscando livros no banco...')
    const result = await query.paginate(page, limit)

    //salva o resultado no cache por 5min
    await redis.setex(cacheKey,60 * 5, JSON.stringify(result))

    return result
  }

  /**
   * Criar um livro
   */
  async store({ request }: HttpContext) {
    //Valida os dados enviados na requisição
    const data = await request.validateUsing(bookValidator())
    //cria e salva o livro no banco
    const newBook = await Book.create(data)
    
    //invalidar o cache relacionado a listagem de livros
    const keys = await redis.keys('books:*')
    if(keys.length){
      await redis.del(...keys)
    }

    return newBook
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

    // Invalida cache relacionado a listagem de livros
    const keys = await redis.keys('books:*')
    if (keys.length) {
      await redis.del(...keys)
    }

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

    // Invalida cache relacionado a listagem de livros
    const keys = await redis.keys('books:*')
    if (keys.length) {
      await redis.del(...keys)
    }

    return { message: 'Livro deletado com sucesso'}
  }

}