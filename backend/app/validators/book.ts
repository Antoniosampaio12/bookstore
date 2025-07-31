import vine from '@vinejs/vine'


export function bookValidator(bookIdToIgnore?: number) {
    return vine.compile(
    vine.object({
        title: vine.string().trim().minLength(1),
        author: vine.string().trim().minLength(1),
        year: vine.number().optional(),
        genre: vine.string().trim().optional(),
        isbn: vine.string().trim().unique(async (db, value) => {
            //Query que busca o id do livro com o isbn passado
            const query = db.from('books').select('id').where('isbn',value)

            //(SOMENTE UPDATE, onde passo o ID)
            //Se o Id na requisição pertencer ao isbn registrado, 
            //ignora ID com o isbn registrado 
            if(bookIdToIgnore){
                query.whereNot('id', bookIdToIgnore)
            }
            // Busca se há registro
            const match = await query.first() 
            //valida a requisicao(True-ISBN livre/ False-ISBN usado)
            return !match 
        }),
        
    })
)

} 