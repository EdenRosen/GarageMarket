import { Link } from 'react-router-dom'
import { imageBufferToUrl } from '../utils/imageHandle'
import ItemLogo from '../images/item_default1.png'

const UserCard = ({ user }) => {
    const imageURL = imageBufferToUrl(user.profile)

    return (
        <div className='user-card'>
            <Link to={`/user/${user.id}`}>
                <div className='image-preview'>
                    { imageURL ?
                        <img src={imageURL} alt={user.id} />
                        : <img src={ItemLogo} alt={user.id} />
                    }
                </div>
            </Link>
            <div className='user-info'>
                <h2>{user.name}</h2>
            </div>
        </div>
    )
}

export default UserCard