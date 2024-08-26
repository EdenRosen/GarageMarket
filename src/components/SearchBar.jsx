import { FaSearch } from 'react-icons/fa'
import { useState } from 'react'

const SearchBar = ({ searchAction }) => {
    const [input, setInput] = useState('')

    const handleSearch = (value) => {
        setInput(value)
        try {
            searchAction(value)
        } catch {
            console.log();
        }
    }

    return (
        
        <div className='search-wrapper'>
            <FaSearch className='search-icon' />
            <input
                placeholder='Search'
                value={input}
                onChange={e => handleSearch(e.target.value)}
            />
        </div>
    )
}

export default SearchBar