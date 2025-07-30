import vine from '@vinejs/vine'

//validar os dados enviados nas requisições de registro
//prevenindo inconsistencias  e insegurança nos dados
export const registerValidator = vine.compile(
    vine.object({
        name: vine.string(),
        email: vine.string().email().toLowerCase().normalizeEmail().trim()
        .unique( async (db, value) => {
            const match = await db.from('users').select('id')
            .where('email',value).first()
            return !match
        }),
        password: vine.string().minLength(8),
    })
)

//validar os dados enviados nas requisições de login
export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().email().toLowerCase().trim(),
        password: vine.string(),
    })
)