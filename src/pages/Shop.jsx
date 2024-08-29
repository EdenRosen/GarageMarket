import { useParams, Link, useNavigate, useSearchParams  } from 'react-router-dom'
import { useEffect } from 'react'
import { useState, useRef } from 'react'
import { TextField, MenuItem, FormControlLabel, Switch } from '@mui/material';
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md";
import ItemCard from '../components/ItemCard'
import SearchSystem from '../components/SearchSystem'
import ShopNavbar from '../components/ShopNavbar'
import { useDatabase } from '../contexts/DatabaseContext'
import { useAuth } from '../contexts/AuthContext'
import { imageBufferToUrl } from '../utils/imageHandle'
import AlertMessage from '../components/AlertMessage'
import ImageInput from '../components/ImageInput'
import axios from '../services/api'

const Shop = () => {
    const { refetch, items, shops, users, categories } = useDatabase()
    const nameRef = useRef()
    const locationRef = useRef()
    const message1Ref = useRef()
    const message2Ref = useRef()
    const [itemStyle, setItemStyle] = useState('')
    const [itemAlign, setItemAlign] = useState('')
    const [bannerColor, setBannerColor] = useState('')
    const descriptionRef = useRef()
    const [image, setImage] = useState()
    const [image2, setImage2] = useState()
    const [image3, setImage3] = useState()
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { currentUser, getToken } = useAuth()
    const [search, setSearch] = useState('')
    const [searchParams, setSearchParams] = useSearchParams()

    const shop = shops.find(e => e.id.toString() === id)
    const collection = searchParams.get('collection')
    const shopStyle = shop ? JSON.parse(shop.style) : null
    const collections = shopStyle?.collections ? shopStyle.collections : []
    useEffect(() => {
        if (!shop) {
            navigate('/not-found')
            return
        }
        if (collection && !collections.includes(collection)) {
            navigate(`/shop/${id}`)
            return
        }
    }, [navigate, shop, collection, collections, id])
    if (!shop) {
        return
    }
    
    // initiate select values
    const itemStyles = [
        { value: '1', label: 'Style 1' },
        { value: '2', label: 'Style 2' },
        { value: '3', label: 'Style 3' },
        { value: '4', label: 'Style 4' },
        { value: '5', label: 'Style 5' },
        { value: '6', label: 'Style 6' },
        { value: '7', label: 'Style 7' },
    ]
    const COLORS = [
        { value: '#FFFFFF', label: 'White' },
        { value: '#F0EFEB', label: 'Vintage White' },
        { value: '#1abc9c', label: 'Turquoise' },
        { value: '#2ecc71', label: 'Green' },
        { value: '#3498db', label: 'Blue' },
        { value: '#2c3e50', label: 'Dark Blue' },
        { value: '#9b59b6', label: 'Purple' },
        { value: '#f1c40f', label: 'Yellow' },
        { value: '#e67e22', label: 'Orange' },
        { value: '#e74c3c', label: 'Red' },
        { value: '#95a5a6', label: 'Gray' },
    ]
    const alignOptions = [
        { value: '1', label: 'Left' },
        { value: '2', label: 'Right' },
    ]

    // info logic
    const shopTexts = JSON.parse(shop.texts)
    const user = users.find(e => e.id === shop.UserId)
    const shopItems = items.filter(e => e.ShopId.toString() === id)
    const imageURL = imageBufferToUrl(shop.banner)
    var thisUser = null
    var myShop = false

    if (currentUser) {
        thisUser = users.find(e => e.email === currentUser.email)
        myShop = user.id === thisUser.id
    }
    if (!itemStyle && shopStyle?.item) setItemStyle(shopStyle.item)
    if (!itemAlign && shopStyle?.itemAlign) setItemAlign(shopStyle.itemAlign)
    if (!bannerColor && shopStyle?.bannerColor) setBannerColor(shopStyle.bannerColor)


    const handleDelete = e => {
        if (collection) {
            e.preventDefault()
            const styleObject = shopStyle
            if (collections.length == 0) return
            styleObject.collections = collections.filter(c => c != collection)
            
            
            setLoading(true)
            axios.patch(
                `shops/${id}`,
                { style: JSON.stringify(styleObject) },
                { headers: { Authorization: `Bearer ${getToken()}` } },
            ).then(() => {
                refetch()
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                setLoading(false)
            })
            return
        }




        axios.delete(
            `shops/${id}`,
            { headers: { Authorization: `Bearer ${getToken()}` } },
        ).then(() => {
            refetch()
            navigate(`/user/${user.id}`)
        }).catch(e => {
            console.log(e);
        })
    }
    
    
    const handleSubmit = (e) => {
        e.preventDefault()
        const name = nameRef.current.value
        const location = locationRef.current.value
        const message1 = message1Ref.current.value
        const message2 = message2Ref.current.value
        const description = descriptionRef.current.value
        const shopFound = shops.find(shop => shop.name === name)

        if (shopFound && shopFound.id.toString() !== id) {
            setErrorMessage(`Shop name "${name}" is already Taken`)
            return
        }

        var updateInfo = {}
        if (name !== '') { updateInfo.name = name }
        if (location !== '') { updateInfo.location = location }
        updateInfo.banner = image
        updateInfo.logo = image2
        updateInfo.icon = image3
        updateInfo.description = description

        var styleObject = shopStyle
        if (itemStyle !== '') { styleObject.item = itemStyle }
        if (itemAlign !== '') { styleObject.itemAlign = itemAlign }
        if (bannerColor !== '') { styleObject.bannerColor = bannerColor }
        updateInfo.style = JSON.stringify(styleObject)

        const textsObject = { message1, message2 }
        updateInfo.texts = JSON.stringify(textsObject)
        
        setLoading(true)
        axios.patch(
            `shops/${id}`,
            updateInfo,
            { headers: { Authorization: `Bearer ${getToken()}` } },
        ).then(() => {
            refetch()
        }).catch(e => {
            console.log(e);
        }).finally(() => {
            setLoading(false)
        })
    }

    const Card = (item) => {
        return (
            <ItemCard item={item} shop={null} shopStyle={shopStyle} />
        )
    }
    const itemType = shopStyle.item ? shopStyle.item : '2'

    return (
        <div className={`page shop-page ${shopTexts?.message1 ? 'high':''}`}>
            <ShopNavbar
                shop={shop}
                color={shopStyle?.bannerColor ? shopStyle.bannerColor : '#FFFFFF'}
                message={shopTexts?.message1 ? shopTexts.message1 : ''}
                searchAction={setSearch}
                collection={collection}
            />
            <div className='shop-banner'>
                { imageURL ?
                    <img src={imageURL} alt='preview' />
                    : <div></div>
                }
            </div>
            <div className='shop-info'>
                <div className='title'>
                    <h1>{
                        collection ? collection : (shopTexts?.message2 && shopTexts.message2)
                    }</h1>
                    { myShop &&
                    <FaEdit
                        onClick={() => setEditMode(!editMode)}
                        className={'edit-icon ' + (editMode ? 'edit-mode' : '')}
                    />
                    }
                </div>




                { editMode && !collection &&
                <div className='edit-shop'>
                    <form onSubmit={handleSubmit}>
                        <div className='button-row'>
                            <Link to={`/shop/${id}/create-item`} className='button big-button'>Add Item</Link>
                            <Link to={`/shop/${id}/create-collection`} className='button big-button'>Add collection</Link>
                        </div>
                        { errorMessage && <AlertMessage text={ errorMessage } /> }
                        <div className='button-row'>
                            <button className='button big-button'>
                                { !loading && <span>Update</span> }
                                { loading && <span disabled>Updating...</span> }
                            </button>
                            <button className='button delete-button' onClick={e => handleDelete(e)}>
                                <MdDelete className='icon'/>
                            </button>
                        </div>
                        <TextField
                            className='input-field'
                            label="Shop name"
                            type='text'
                            inputRef={nameRef}
                            defaultValue={ shop.name ? shop.name : '' }
                        />
                        <TextField
                            className='input-field'
                            label="Location"
                            type='text'
                            inputRef={locationRef}
                            defaultValue={ shop.location ? shop.location : '' }
                        />
                        <TextField
                            className='input-field'
                            label="Upper message"
                            type='text'
                            inputRef={message1Ref}
                            defaultValue={ shopTexts?.message1 ? shopTexts.message1 : '' }
                        />
                        <TextField
                            className='input-field'
                            label="Main message"
                            type='text'
                            inputRef={message2Ref}
                            defaultValue={ shopTexts?.message2 ? shopTexts.message2 : '' }
                        />
                        <TextField
                            className='input-field'
                            select
                            label="Item card style"
                            value={itemStyle}
                            onChange={e => setItemStyle(e.target.value) }
                            >
                            {itemStyles.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            className='input-field'
                            select
                            label="Item text align"
                            value={itemAlign}
                            onChange={e => setItemAlign(e.target.value) }
                            >
                            {alignOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            className='input-field'
                            select
                            label="Banner color"
                            value={bannerColor}
                            onChange={e => setBannerColor(e.target.value) }
                            >
                            {COLORS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            className='input-field'
                            label="Description"
                            multiline
                            rows={4}
                            defaultValue={ shop.description ? shop.description : '' }
                            inputRef={descriptionRef}
                        />
                        <div className='order1'>
                            <ImageInput
                                className='input-field'
                                handleImage={ image => setImage2(image) }
                                defaultImage={ shop.logo }
                                text='Logo'
                                size={400}
                                quality={60}
                                compressFormat='PNG'
                            />
                            <ImageInput
                                className='input-field'
                                handleImage={ image => setImage3(image) }
                                defaultImage={ shop.icon }
                                text='Icon'
                                size={400}
                                quality={60}
                            />
                        </div>
                        <ImageInput
                            className='input-field'
                            handleImage={ image => setImage(image) }
                            defaultImage={ shop.banner }
                            text='Banner'
                            size={800}
                            quality={60}
                        />
                    </form>
                </div>
                }
                { editMode && collection &&
                <div className='edit-shop'>
                    <form>
                        <div className='button-row'>
                            <button className='button delete-button big-button' onClick={handleDelete}>
                                <MdDelete className='icon'/>
                            </button>
                        </div>
                    </form>
                    </div>
                }



            </div>
            <div className={`items-list type${itemType}`}>
                <SearchSystem
                    elements={shopItems.filter(item => {
                        const itemCollection = JSON.parse(item.shopStyle ? item.shopStyle : null)?.collection
                        return !collection || itemCollection == collection
                    })}
                    Card={Card}
                    name='items'
                    shopStyle={shopStyle}
                    searchValue={search}
                />    
            </div>
            
        </div>
    )
}
 
export default Shop