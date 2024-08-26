import { Link } from 'react-router-dom'
import { imageBufferToUrl } from '../utils/imageHandle'
import ItemLogo from '../images/shop_default1.png'

const ShopCard = ({ shop, user, myShop=false }) => {
    const imageURL = imageBufferToUrl(shop?.icon)

    return (
        <div className="shop-card">
            <Link to={`/shop/${shop?.id}`}>
                <div className='image-preview'>
                    { imageURL ?
                        <img src={imageURL} alt={shop.id} />
                        : <img src={ItemLogo} alt={shop.id} />
                    }
                </div>
            </Link>
            <div className='shop-info'>
                <h2>{shop.name}</h2>
            </div>
        </div>
    )
}

export default ShopCard