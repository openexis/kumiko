import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts"

const SHIKIMORI = "https://shikimori.me/"

async function search_anime(name: string) {
    const ID_URL = `https://shikimori.me/api/animes?search=${name}`
    
    const id_response = await axiod.get(ID_URL)
    const id = id_response.data[0].id;
    const URL = `https://shikimori.me/api/animes/${id}`

    const response = await axiod.get(URL)
    const res = response.data
    return {
        "id": id,
        "name": res.name,
        "russian": res.russian,
        "image": res.image.original,
        "url": res.url,
        "rating": res.score,
        "status": res.status,
        "license_name": res.license_name_ru,
        "episodes": res.episodes,
        "description": res.description?.replaceAll(/\[(.*?)\]/g, " ").slice(0,847) + "..."
    }

}

export { search_anime, SHIKIMORI }