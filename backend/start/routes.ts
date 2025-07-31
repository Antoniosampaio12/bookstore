/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import BooksController from '#controllers/books_controller'

router.group(() => {
    router.post('/register', [AuthController, 'register']).as('auth.register')
    router.post('/login', [AuthController, 'login']).as('auth.login')
    router.delete('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
    router.get('/me', [AuthController, 'me']).as('auth.me')

    router.group(() => {
      router.get('/', [BooksController, 'index'])
      router.get('/:id', [BooksController, 'show'])
      router.post('/', [ BooksController, 'store']).use(middleware.auth())
      router.put('/:id', [BooksController, 'update']).use(middleware.auth())
      router.delete('/:id', [BooksController, 'destroy']).use(middleware.auth())
    }).prefix('/books')

  }).prefix('/api')


