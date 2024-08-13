export const deadChars = async (mensaje) =>{

    const dt = mensaje.split('/') // [dead, name]

    const res = await fetch(`https://rickandmortyapi.com/api/character/?name=${dt[1]}&species=${dt[0]}`)
    const { results } = await res.json()

    return { pj_uno: results[0], pj_dos: results[1]}

} 