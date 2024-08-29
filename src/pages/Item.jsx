import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { FaEdit } from "react-icons/fa"
import { IoIosArrowBack } from "react-icons/io"
import { FaHeart, FaRegHeart } from "react-icons/fa6"
import { MdDelete } from "react-icons/md";
import { TextField, MenuItem, Autocomplete } from '@mui/material';
import { useDatabase } from '../contexts/DatabaseContext'
import { useAuth } from '../contexts/AuthContext'
import { imageBufferToUrl } from '../utils/imageHandle'
import ItemLogo from '../images/item_default1.png'
import AlertMessage from '../components/AlertMessage'
import ImageInput from '../components/ImageInput'
import TableInput from '../components/TableInput'
import ShopNavbar from '../components/ShopNavbar'
import axios from '../services/api'

const Item = ({ show=false }) => {
    const { id } = useParams()
    const { refetch, items, shops, users, categories } = useDatabase()
    const navigate = useNavigate()
    const { currentUser, getToken } = useAuth()
    const [editMode, setEditMode] = useState(false)
    const nameRef = useRef()
    const [collection, setCollection] = useState('')
    const [currency, setCurrency] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState(null)
    const descriptionRef = useRef()
    const [table, setTable] = useState([])
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showSeller, setShowSeller] = useState(false)
    const [like, setLike] = useState(false)
    const [likes, setLikes] = useState([])

    // check if item exists
    const item = items.find(e => e.id.toString() === id)
    const myItem = currentUser && shops.find(e => e.id == item?.ShopId)?.UserId == currentUser.id
    useEffect(() => {
        if (!item) {
            navigate('/not-found')
        }
        setPrice(item?.price)
        setCurrency(item?.currency)
        
        if (currentUser) {
            var likes = JSON.parse(item.likes)
            if (!likes) likes = []
            setLikes(likes)
            const liked = likes.find(e => currentUser.id == e)
            if (liked) setLike(true)    
        }
        
    }, [navigate, item, currentUser])
    if (!item) {
        return
    }

    // initiate select values
    const currencyOptions = [
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' },
        { value: 'ILS', label: 'ILS' },
    ]
    const currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'ILS': '₪',
    }

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
            if (option.value == item.CategoryId && !category) {
                setCategory(option)
            }
        }
    }
    


    // info logic
    const shop = shops.find(e => item.ShopId === e.id)
    const shopStyle = JSON.parse(shop.style)
    const shopTexts = JSON.parse(shop.texts)
    const collections = shopStyle?.collections ? shopStyle.collections : []
    const tableData = item.tableData == null ? [] : JSON.parse(item.tableData)
    const user = users.find(e => e.id === shop.UserId)
    // const ItemCategory = categories.find(e => e.id === item.CategoryId)
    const imageURL = imageBufferToUrl(item.image)
    const profileURL = imageBufferToUrl(user.profile)
    const myItems = items ? items.filter(e => e.ShopId.toString() === id) : null

    // initiate collections
    const collectionsOptions = collections.map(c => ({ value: c, label: c }))
    const itemCollection = JSON.parse(item.shopStyle ? item.shopStyle : null)?.collection
    if (!collection && itemCollection) {
        setCollection(itemCollection)
    }
    





    // handle functions
    const navigateBack = () => {
        if (show) {
            navigate('/')
        } else {
            navigate(`/shop/${shop.id}`)
        }
    }

    const handleDelete = () => {
        axios.delete(
            `items/${id}`,
            { headers: { Authorization: `Bearer ${getToken()}` } },
        ).then(() => {
            refetch()
            navigate(`/shop/${shop.id}`)
        }).catch(e => {
            console.log(e);
        })
    }

    const handleImage = image => setImage(image)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        const name = nameRef.current.value
        const description = descriptionRef.current.value
        const itemFound = myItems.find(item => item.name === name)

        if (itemFound) {
            setErrorMessage(`Item named "${name}" already exists in this shop`)
            return
        }
        
        var updateInfo = {}
        if (name !== '') { updateInfo.name = name }
        updateInfo.currency = currency
        updateInfo.price = price
        updateInfo.CategoryId = category?.value
        updateInfo.description = description
        updateInfo.tableData = JSON.stringify(table)
        console.log(image?.length);
        
        updateInfo.image = image
        var shopStyleUpdate = {
            collection: collection,
        }
        updateInfo.shopStyle = JSON.stringify(shopStyleUpdate)
        
        setLoading(true)
        axios.patch(
            `items/${item.id}`,
            updateInfo,
            { headers: { Authorization: `Bearer ${getToken()}` } },
        ).then(() => {
            refetch()
            navigate(`/item/${item.id}`)
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleLike = (e) => {
        e.preventDefault()
        if (loading) return
        if (!currentUser) {
            navigate('/login')
            return
        }

        const liked = likes.find(e => currentUser.id == e)

        if (!like && !liked) {
            setLike(true)
            var newLikes = likes
            newLikes.push(currentUser.id)
            setLikes(newLikes)
        } else if (like && liked) {
            setLike(false)
            var newLikes = likes
            const index = newLikes.indexOf(currentUser.id)
            newLikes.splice(index, 1)
            setLikes(newLikes)
        } else {
            return
        }
        
        setLoading(true)
        axios.patch(
            `items/${item.id}/likes`,
            { likes: JSON.stringify(likes) },
            { headers: { Authorization: `Bearer ${getToken()}` } },
        ).then(() => {
            setLike(!like)
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            setLoading(false)
        })
    }


    return (
        <div className={`page item-page ${shopTexts?.message1 ? 'high':''}`}>
            <ShopNavbar
                shop={shop}
                color={ shopStyle.bannerColor }
                message={ shopTexts.message1 ? shopTexts.message1 : '' }
                showHome={false}
            />
            <div className='back-button-container'>
                <div className='back-button' onClick={navigateBack}>
                    <IoIosArrowBack/>
                </div>
            </div>
            <main>
                <div className='image-preview'>
                    { !shopStyle.hideLike && currentUser && !myItem &&
                        <div className={`like-area` + (like ? ' activated' : '')} onClick={handleLike}>
                            <div className='likes-count'>{ likes.length }</div>
                            { like ? <FaHeart/> : <FaRegHeart/> }
                        </div>
                    }
                    { imageURL ?
                        <img src={imageURL} alt='preview' />
                        : <img src={ItemLogo} alt={item.id} />
                    }
                </div>
                <div className='main-info-container'>
                    <div className='main-info'>
                        <h1>{item.name}</h1>
                        <h3>
                            { item.price !== '0' ?
                                `${currencySymbols[item.currency]}${item.price}`
                                : `Free`
                            }
                        </h3>
                        { !showSeller ?
                            <button
                                className="show-seller-button"
                                type="button"
                                onClick={() => {
                                    setShowSeller(true)
                                }
                            }>Show seller</button>
                            : 
                            <div className='user-display'>
                                <div className='title'>
                                    <div className='image-preview'>
                                        { profileURL ?
                                            <img src={profileURL} alt='preview' />
                                            : <img src={ItemLogo} alt='preview' />
                                        }
                                    </div>
                                    <h2>{user.name}</h2>   
                                </div>
                                <div className='user-info'>
                                    <div>{user.email}</div>
                                    <div>{user.phone}</div>
                                </div>
                                {/* <button
                                    className="show-seller-button"
                                    type="button"
                                    onClick={() => {
                                        setShowSeller(true)
                                    }
                                }>Send buy request</button> */}
                            </div>
                        }
                        
                    </div>    
                </div>
                { item.description &&
                    <>
                        {/* <hr/> */}
                        <div className='description'>{item.description}</div>
                    </>
                }
                { tableData.length > 0 &&
                    <div className='details'>
                        <h2>Details</h2>
                        <div className='table-data'>
                            {tableData.map((row, index) => {
                                return (
                                    <div key={index} className='row'>
                                        <div className='key'>{row.key}</div>
                                        <div className='value'>{row.value}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }
            </main>







            <div className='bottom'>
                { myItem &&
                <FaEdit
                    onClick={() => setEditMode(!editMode)}
                    className={'edit-icon ' + (editMode && 'edit-mode')}
                />
                }
                { editMode &&
                <div className=''>
                    <h1>Update Info</h1>
                    <form onSubmit={handleSubmit}>
                        { errorMessage && <AlertMessage text={ errorMessage } /> }
                        <div className='button-row'>
                            <button className='button big-button'>
                                { !loading && <span>Update</span> }
                                { loading && <span disabled>Updating...</span> }
                            </button>
                            <button className='button delete-button' onClick={handleDelete}>
                                <MdDelete className='icon'/>
                            </button>
                        </div>
                        <TextField
                            className='input-field'
                            label="Name"
                            type='text'
                            inputRef={nameRef}
                            defaultValue={ item.name }
                        />
                        { collections.length > 0 &&
                            <TextField
                                className='input-field'
                                select
                                label="Collection"
                                value={collection}
                                onChange={e => setCollection(e.target.value) }
                                >
                                {collectionsOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        }
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
                            onChange={ (e, val) => setCategory(val) }
                        />
                        <TextField
                            className='input-field'
                            label="Description"
                            multiline
                            rows={4}
                            defaultValue={ item.description }
                            inputRef={descriptionRef}
                        />
                        <TableInput
                            handleTable={ table => setTable(table) }
                            defaultTable={ tableData }
                        />
                        <ImageInput
                            className='input-field'
                            handleImage={ handleImage }
                            defaultImage={ item.image }
                            text='Add item picture'
                            size={500}
                            quality={50}
                        />
                    </form>
                </div>
                }




            </div>
        </div>
    )
}
 
export default Item