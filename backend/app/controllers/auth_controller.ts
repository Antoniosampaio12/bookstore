import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'


export default class AuthController {

    //Metodo Registar Usuario
    public async register({ request }: HttpContext) {
        //valida os dados
        const data = await request.validateUsing(registerValidator)
        //cria o usuario e salva no banco
        const user = await User.create(data)
      
        return {
            message: 'Usuário registrado com sucesso!',
            user: user
        }
    }

    public async login({ request }: HttpContext){
        //valida o email e a senha
        const {email,password} = await request.validateUsing(loginValidator)
        //verifica se o email existe e a senha coincide
        const user = await User.verifyCredentials(email,password)
        //gera o token jwt
        return User.accessTokens.create(user)
    }

    public async logout({ auth }: HttpContext){
        //pega o usuario autenticado
        const user = auth.user!
        // deleta no banco o token atual
        await User.accessTokens.delete(user,user.currentAccessToken.identifier)
        return {message: 'Desconectado com sucesso!'}
    }

    // mostrar as informações so usuario logado
    public async me({ auth }: HttpContext){
        await auth.check()
        return {user: auth.user, }
    }

}
