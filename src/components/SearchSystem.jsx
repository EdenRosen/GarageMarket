import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'

const SearchSystem = ({ elements, Card, name, align='cards-left', shopStyle=null, searchValue=null }) => {
    const [search, setSearch] = useState('')
    
    useEffect(() => {
        setSearch(searchValue)
    }, [searchValue])
    
    var filteredElements = elements
    if (search) {
        filteredElements = elements.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    }
    
    const itemStyle = shopStyle?.item ? shopStyle.item : null
    
    return (
        <div>
            { searchValue == null && <SearchBar searchAction={setSearch} /> }
            <div className='cards-list-container'>
                <div>
                <div className={'cards-list'}>
                    { filteredElements.map(element => (
                        <div key={element.id}>
                            { Card(element) }
                        </div>
                    ))}
                    { filteredElements.length === 0 &&
                    <div>
                        { elements.length === 0 &&
                            <p>No {name} exist</p>
                        }
                        { elements.length > 0 &&
                            <p>No {name} were found</p>
                        }
                    </div>
                    }
                </div>
                </div>
            </div>
        </div>
    )
}

export default SearchSystem