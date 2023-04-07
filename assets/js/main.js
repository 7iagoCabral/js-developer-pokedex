const pokemonList = document.getElementById('pokemonList')
const pokemonElement = document.getElementById('pokemon')
const loadMoreButton = document.getElementById('loadMoreButton')

console.log(window.location.href)
window.addEventListener('hashchange', () => {
    let pokemonId = window.location.hash.substring(1)
    fetch('https://pokeapi.co/api/v2/pokemon/'+ pokemonId)
    .then(res => res.json())
    .then(pokemon => {
        console.log(pokemon)
        pokemonList.style.display = 'none'
        loadMoreButton.style.display = 'none'
        pokemonElement.innerHTML = loadPokemonDetail({
            name: pokemon.name, 
            number: pokemon.id,
            type: pokemon.types[0].type.name,
            photo: pokemon.sprites.other.dream_world.front_default,
            detail: {
                weight: pokemon.weight,
                species: pokemon.species.name,
                stats: pokemon.stats
                



            }
         })
    })
    .catch(err => console.log(err))

    
})

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <a href="#${pokemon.number}">
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
        </a>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function loadPokemonDetail(pokemon) {
    return `
    <div class="pokemon-detail ghost">
    <div class="container-title">
        <div>
        <h2>${pokemon.name}</h2>
        <span class="type">${pokemon.type}</span>
        </div>
        <span>#${pokemon.number}</span>
    </div>

    <img src="${pokemon.photo}" alt="" class="pokemon-photo" />

    <div class="content-detail">
     <p>species: ${pokemon.detail.species}</p>
     <p>weight: ${pokemon.detail.weight}</p>
     ${pokemon.detail.stats.map(status => `<p>${status.stat.name}: ${status.base_stat}</p>`
     ).join('')}
    </div>
    
    </div>
    `
}

