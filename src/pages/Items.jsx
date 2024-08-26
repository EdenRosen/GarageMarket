import { useState } from 'react'
import { TextField, MenuItem, Autocomplete } from '@mui/material';
import { useDatabase } from '../contexts/DatabaseContext'
import ItemCard from '../components/ItemCard'
import SearchSystem from '../components/SearchSystem'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Items = () => {
    const { items, shops, users, categories } = useDatabase()
    const [search, setSearch] = useState('')
    const [currency, setCurrency] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState(null)

    // initiate select values
    const ITEM_COUNT_LIMIT = 100
    const currencyOptions = [
        { value: 'All', label: 'All' },
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'ILS', label: 'ILS' },
    ]

    var categoriesOptions = [{
        value: null,
        label: 'No category'
    }]
    if (categories) {
        for (let i = 0; i < categories.length; i++) {
            const option = {
                value: categories[i].id,
                label: categories[i].name,
            }
            categoriesOptions.push(option)
        }
    }



    const Card = (item) => {
        return (
            <ItemCard
                item={item}
                shop={shops.find(shop => shop.id === item.ShopId)}
                show={true}
            />
        )
    }

    var filteredItems = items
    
    if (currency && currency !== 'All') {
        filteredItems = filteredItems.filter(item => item.currency == currency)
    }
    if (category?.value) {
        filteredItems = filteredItems.filter(item => item.CategoryId == category.value)
    }
    if (price) {
        filteredItems = filteredItems.filter(item => parseFloat(item.price) <= price)
    }
    
    filteredItems = filteredItems.sort((a,b) => {
        const aLikeList = JSON.parse(a.likes) || []
        const bLikeList = JSON.parse(b.likes) || []
        return aLikeList.length < bLikeList.length ? 1 : -1
    })

    if (filteredItems.length > ITEM_COUNT_LIMIT) {
        filteredItems = filteredItems.slice(0, ITEM_COUNT_LIMIT)
    }

    
    return (
        <div className='page items-page'>
            <Navbar searchAction={setSearch} />
            <div className='expand-content'>
            <h1 className='title'>Items</h1>
            { filteredItems && shops &&
            <div className='items-page'>
                <div className='conditions'>
                    <label>Search by:</label>
                    <TextField
                        className='input-field'
                        select
                        label="Currency"
                        value={currency}
                        onChange={e => setCurrency(e.target.value) }
                        >
                        {currencyOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        className='input-field'
                        label="Price limit"
                        type='text'
                        value={price}
                        onChange={e => {
                            const val = e.target.value
                            if (!isNaN(val)) setPrice(e.target.value)
                        }}
                    />
                    <Autocomplete
                        className='input-field'
                        options={categoriesOptions}
                        renderInput={(params) => <TextField {...params} label="Category" />}
                        value={category}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        onChange={ (e, val) => setCategory(val) }
                    />
                </div>
                
                <div className={`items-list type2`}>
                    <SearchSystem
                        elements={filteredItems}
                        Card={Card}
                        name={'items'}
                        searchValue={search}
                    />
                </div>
            </div>
            }    
            </div>
            <Footer/>
        </div>
    )
}

export default Items