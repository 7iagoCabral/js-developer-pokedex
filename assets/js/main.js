const pokemonList = document.getElementById('pokemonList')
const pokemonElement = document.getElementById('pokemon')
const loadMoreButton = document.getElementById('loadMoreButton')

window.addEventListener('hashchange', () => {
    console.log(window.location.href)
    if(window.location.hash.substring(1) == undefined || window.location.hash.substring(1) == 0){
        pokemonList.style = ''
        loadMoreButton.style.display = 'block'
        pokemonElement.style.display = 'none'
        return
    }

    let pokemonId = window.location.hash.substring(1)
    fetch('https://pokeapi.co/api/v2/pokemon/'+ pokemonId)
    .then(res => res.json())
    .then(pokemon => {
        pokemonList.style.display = 'none'
        loadMoreButton.style.display = 'none'
        pokemonElement.style.display = ''
        pokemonElement.innerHTML = loadPokemonDetail({
            name: pokemon.name, 
            number: pokemon.id,
            type: pokemon?.types[0]?.type.name,
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
    const statusColor = {
        'hp': 'green',
        'attack': 'red',
        'defense': 'brown',
        'special-attack': 'orange',
        'special-defense': 'yellow',
        'speed': 'blue'

    }

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
    <div class="infos">
        <span class="tag">species: ${pokemon.detail.species}</span>
        <span class="tag">weight: ${pokemon.detail.weight}</span>
        <span class="tag">type: ${pokemon.type}</span>
     </div>
     <div>
        ${pokemon.detail.stats.map(status => `
            <div style="display: flex; flex-direction: row; align-items: center;">
                <div style="width: 160px;">${status.stat.name}  </div> <div style="width: 40px; text-align: center;">${status.base_stat}</div>
                <div class="status" style="background: linear-gradient(to right, ${statusColor[status.stat.name]} 0% ${(status.base_stat*100)/255}%, #c7c7c7 ${(status.base_stat*100)/255}%);"></div>
            </div>`
        ).join('')}
        </div>
    </div>
    
    </div>
    `
}

