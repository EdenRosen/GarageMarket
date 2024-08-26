import { useParams, Link, useNavigate } from 'react-router-dom'
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

const ShopAbout = () => {
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

    const shop = shops.find(e => e.id.toString() === id)
    useEffect(() => {
        if (!shop) {
            navigate('/not-found')
        }
    }, [navigate, shop])
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
    const shopStyle = JSON.parse(shop.style)
    const shopTexts = JSON.parse(shop.texts)
    const user = users.find(e => e.id === shop.UserId)
    const shopItems = items.filter(e => e.ShopId.toString() === id)
    var thisUser = null
    var myShop = false

    if (currentUser) {
        thisUser = users.find(e => e.email === currentUser.email)
        myShop = user.id === thisUser.id
    }
    if (!itemStyle && shopStyle?.item) setItemStyle(shopStyle.item)
    if (!itemAlign && shopStyle?.itemAlign) setItemAlign(shopStyle.itemAlign)
    if (!bannerColor && shopStyle?.bannerColor) setBannerColor(shopStyle.bannerColor)
    
    

    const imageURL = imageBufferToUrl(shop.banner)

    const handleDelete = () => {
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
        <div className={`page shop-about-page ${shopTexts?.message1 ? 'high':''}`}>
            <ShopNavbar
                shop={shop}
                color={shopStyle?.bannerColor ? shopStyle.bannerColor : '#FFFFFF'}
                message={shopTexts?.message1 ? shopTexts.message1 : ''}
                searchAction={setSearch}
            />
            <main>
                <section className='shop-info'>
                    <div>
                        <span className='bold-text'>Owner: </span>
                        <Link className='regular-link' to={`/user/${user.id}`}>
                            {user.name}
                        </Link>
                    </div>
                    { shop.location &&
                        <div>
                            <span className='bold-text'>Location: </span>
                            <span>{shop.location}</span>
                        </div>
                    }
                </section>
                <section className='about-info'>
                    <h1>About {shop.name}</h1>
                    { shop.description &&
                        <div className='description'>{shop.description}</div>
                    }
                </section>
            </main>
            
        </div>
    )
}
 
export default ShopAbout