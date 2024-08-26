import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io"
import { TextField, MenuItem, Autocomplete } from '@mui/material';
import { useDatabase } from '../contexts/DatabaseContext'
import { useAuth } from '../contexts/AuthContext'
import AlertMessage from '../components/AlertMessage'
import ImageInput from '../components/ImageInput'
import ShopNavbar from '../components/ShopNavbar'
import axios from '../services/api'


const CreateItem = () => {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    const { id } = useParams()
    const { refetch, items, shops, users, categories } = useDatabase()
    const nameRef = useRef()
    const [currency, setCurrency] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState(null)
    const [image, setImage] = useState()
    const { getToken } = useAuth()

    const shop = shops.find(e => e.id.toString() === id)
    useEffect(() => {
        if (!shop) navigate('/not-found')
    }, [navigate, shop])
    if (!shop) {
        return
    }

    // initiate select values
    const currencyOptions = [
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

    // info logic
    const myItems = items ? items.filter(e => e.ShopId.toString() === id) : null
    const shopStyle = JSON.parse(shop.style)
    const shopTexts = JSON.parse(shop.texts)

    // handle functions
    const navigateBack = () => navigate(`/shop/${shop.id}`)
    
    const handleSubmit = (e) => {
        e.preventDefault()

        const name = nameRef.current.value
        const itemFound = myItems.find(item => item.name === name)

        if (itemFound) {
            setErrorMessage(`Item named "${name}" already exists in this shop`)
            return
        }

        const categoryId = category ? category.value : null
        const item = {
            ShopId: id,
            name,
            currency: currency ? currency : 'USD',
            price: price ? price : '0', 
            CategoryId: categoryId,
            image: image ? image : null
        }

        setLoading(true)
        axios.post(
            `/items`,
            item,
            { headers: { Authorization: `Bearer ${getToken()}` } },
        ).then(() => {
            refetch()
            navigate(`/shop/${id}`)
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className='page create-item-page'>
            <ShopNavbar
                shop={shop}
                color={ shopStyle.bannerColor ? shopStyle.bannerColor : '#FFFFFF' }
                message=''
                showHome={false}
            />
            <div className='back-button-container'>
                <div className='back-button' onClick={navigateBack}>
                    <IoIosArrowBack/>
                </div>
            </div>
            <div>
                <h1>New Item</h1>
                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        className='input-field'
                        label="Item name"
                        type='text'
                        inputRef={nameRef}
                    />
                    <TextField
                        className='input-field'
                        select
                        label="Currency"
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        >
                        {currencyOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        className='input-field'
                        label="Price"
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
                        onChange={(e, val) => setCategory(val)}
                    />
                    <ImageInput
                            handleImage={ image => setImage(image) }
                            text='Add item picture'
                            size={600}
                            // quality={60}
                        />
                    { errorMessage && <AlertMessage text={ errorMessage } /> }
                    <button className='button'>
                        { !loading && <span>Add</span> }
                        { loading && <span disabled>Adding...</span> }
                    </button>
                </form>
            </div>
        </div>
    )
}
 
export default CreateItem