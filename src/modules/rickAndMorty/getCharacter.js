export const getChar =async (mensaje) => {

    const id = mensaje.split("/personaje/")[1]

    const response =await fetch(`https://rickandmortyapi.com/api/character/${id}`)
    const {name, image, status} = await response.json()

    return {name, image, status}
}

export const deadChars = async (mensaje) =>{

    const dt = mensaje.split('/') // [dead, name]

    const res = await fetch(`https://rickandmortyapi.com/api/character/?name=${dt[1]}&status=${dt[0]}`)
    const { results } = await res.json()

    return { pj_uno: results[0], pj_dos: results[1]}

} 


