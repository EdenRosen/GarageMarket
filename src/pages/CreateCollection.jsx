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


const CreateCollection = () => {
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
    const collections = shopStyle?.collections ? shopStyle.collections : []

    // handle functions
    const navigateBack = () => navigate(`/shop/${shop.id}`)
    
    const handleSubmit = (e) => {
        e.preventDefault()

        var error = false
        const name = nameRef.current.value
        if (collections.length) {
            collections.forEach(c => {
                if (name == c) {
                    error = true
                    setErrorMessage(`Collection named "${name}" already exists in this shop`)
                    return
                }
            })
        }
        if (error) return

        const styleObject = shopStyle
        if (!styleObject?.collections) styleObject.collections = [name]
        else styleObject.collections.push(name)

        setLoading(true)
        axios.patch(
            `shops/${id}`,
            { style: JSON.stringify(styleObject) },
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
                <h1>Add collection</h1>
                <form onSubmit={handleSubmit}>
                    <TextField
                        required
                        className='input-field'
                        label="Collection name"
                        type='text'
                        inputRef={nameRef}
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
 
export default CreateCollection