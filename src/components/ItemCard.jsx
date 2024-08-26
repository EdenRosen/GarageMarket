import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { imageBufferToUrl } from '../utils/imageHandle'
import ItemLogo from '../images/item_default1.png'
import { FaHeart, FaRegHeart } from "react-icons/fa6"
import { useAuth } from '../contexts/AuthContext'
import { useDatabase } from '../contexts/DatabaseContext'
import axios from '../services/api'

const ItemCard = ({ item, shop=null, show=false, shopStyle={} }) => {
    const [like, setLike] = useState(false)
    const [likes, setLikes] = useState([])
    const [loading, setLoading] = useState(false)
    const { currentUser, getToken } = useAuth()
    const { items, shops } = useDatabase()
    const navigate = useNavigate()

    const imageURL = imageBufferToUrl(item?.image)
    const shopURL = imageBufferToUrl(shop ? shop.icon : null)
    const itemStyle = shopStyle.item ? shopStyle.item : '2'
    const myItem = currentUser && shops.find(e => e.id == item?.ShopId)?.UserId == currentUser.id

    const currencySymbols = {
        'USD': '$',
        'EUR': '€',
        'ILS': '₪',
    }

    useEffect(() => {
        if (!currentUser) return
        var likes = JSON.parse(item.likes)
        if (!likes) likes = []
        setLikes(likes)
        const liked = likes.find(e => currentUser.id == e)
        if (liked) setLike(true)
    }, [currentUser, item])
    

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
        console.log(`items/${item.id}/likes`);
        
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
        <div className={`item-card type${itemStyle}`}>
            <div className='image-preview'>
                { !shopStyle.hideLike && currentUser && !myItem &&
                    <div className={`like-area` + (like ? ' activated' : '')} onClick={handleLike}>
                        { like ? <FaHeart/> : <FaRegHeart/> }
                    </div>
                }
                <Link to={`/item/${item?.id}` + (show ? '/show' : '')}>
                    { imageURL ?
                        <img src={imageURL} alt={item.id} />
                        : <img src={ItemLogo} alt={item.id} />
                    }
                </Link>
            </div>
            <div className='name'>
                <span>{item.name}</span>
            </div>
            {/* <div className={
                'item-info' + (shopStyle.itemAlign === '2' ? ' right-align' : '')
            }> */}
            <div className='price'>
                { item.price !== '0' ?
                    <>
                        <span>{currencySymbols[item.currency]}</span>
                        <span>{item.price}</span>
                    </>
                    : <span>Free</span>
                }
            </div>
            { ((itemStyle == '4' || itemStyle == '7') && item.description) &&
            <div className='description'>
                <div className='description-text'>{item.description}</div>
            </div>
            }
            { shop &&
            <div className='shop-info'>
                { shopURL && <img src={shopURL} alt={item.id+'d'} /> }
                <label>{shop.name}</label>
            </div>
            }
        </div>
    )
}

export default ItemCard