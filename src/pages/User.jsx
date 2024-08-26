import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md";
import { MuiTelInput } from 'mui-tel-input'
import { TextField, FormControlLabel, Switch } from '@mui/material';
import { useAuth } from '../contexts/AuthContext'
import ImageInput from '../components/ImageInput'
import ShopCard from '../components/ShopCard'
import SearchSystem from '../components/SearchSystem'
import { useDatabase } from '../contexts/DatabaseContext'
import { imageBufferToUrl } from '../utils/imageHandle'
import ItemLogo from '../images/item_default1.png'
import AlertMessage from '../components/AlertMessage'
import Navbar from '../components/Navbar'
import axios from '../services/api'

const User = () => {
    const { id } = useParams()
    const { refetch, items, shops, users, categories } = useDatabase()
    const navigate = useNavigate()
    const { currentUser, logout, getToken } = useAuth()
    const [editMode, setEditMode] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const nameRef = useRef()
    const [phone, setPhone] = useState('')
    const BioRef = useRef()
    const [image, setImage] = useState()
    const [search, setSearch] = useState('')

    const user = users.find(u => u.id.toString() === id)

    useEffect(() => {
        if (!user && currentUser !== undefined) {
            if (id === 'me' && currentUser !== null) {
                const thisUser = users.find(e => e.email === currentUser.email)
                navigate(`/user/${thisUser.id}`)
            } else {
                navigate('/not-found')
            }
        }
        setPhone(user?.phone)
    }, [navigate, user, currentUser, id, users])
    if (!user) {
        return
    }

    const userShops = shops.filter(p => p.UserId.toString() === id)
    const profileURL = imageBufferToUrl(user.profile)

    var myUser = false
    if (currentUser) {
        const thisUser = users.find(e => e.email === currentUser.email)
        myUser = user.id === thisUser.id
    }
    
    const handleLogout = () => {
        try {
            logout()
            navigate('/login')
        } catch {
            // setError('Failed to log out')
        }
    }
    
    const Card = (shop) => {
        return (
            <ShopCard shop={shop} user={null} />
        )
    }

    // const handleDelete = () => {
    //     axios.delete(
    //         `items/${id}`,
    //     ).then(() => {
    //         refetch()
    //         navigate(`/shop/${shop.id}`)
    //     }).catch(e => {
    //         console.log(e);
    //     })
    // }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return

        const name = nameRef.current.value
        const bio = BioRef.current.value
        
        var updateInfo = {}
        if (name !== '') { updateInfo.name = name }
        updateInfo.phone = phone
        updateInfo.bio = bio
        updateInfo.profile = image
        
        setLoading(true)
        axios.patch(
            `users/${id}`,
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
    

    
    return (
        <div className='page user-page'>
            <Navbar searchAction={setSearch} />
            <div className='upper-info'>
                <div className='image-preview'>
                    { profileURL ?
                        <img src={profileURL} alt='preview' />
                        : <img src={ItemLogo} alt='preview' />
                    }
                </div>
                <div className='user-info'>
                    <h1>{user.name}</h1>
                    <div>
                        <span className='bold-text'>Email: </span>
                        <span>{user.email}</span>
                    </div>
                    <div className='bio'>{user.bio}</div>
                    { myUser &&
                    <div className='myUser-info'>
                        <div><Link to={`/create-shop`} className='regular-link'>New Shop</Link></div>
                        <div><span className='regular-link' onClick={handleLogout}>Log out</span></div>
                    </div>
                    }
                </div>
                { myUser &&
                <FaEdit
                    onClick={() => setEditMode(!editMode)}
                    className={'edit-icon ' + (editMode ? 'edit-mode' : '')}
                />
                }
            </div>





            { editMode &&
                <div className='update-container'>
                    <h1>Update Info</h1>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            className='input-field'
                            label="Name"
                            type='text'
                            inputRef={nameRef}
                            defaultValue={ user.name }
                        />
                        <MuiTelInput
                            className='input-field'
                            value={phone}
                            onChange={ value => setPhone(value) }
                            placeholder='Phone number'
                        />
                        <TextField
                            className='input-field'
                            label="Bio"
                            multiline
                            rows={4}
                            defaultValue={ user.bio }
                            inputRef={BioRef}
                        />
                        <ImageInput
                            className='input-field'
                            handleImage={ image => setImage(image) }
                            defaultImage={ user.profile }
                            text='Add profile picture'
                            size={600}
                            // quality={60}
                                compressFormat='PNG'
                        />
                        { errorMessage && <AlertMessage text={ errorMessage } /> }
                        <div className='button-row'>
                            <button className='button update-button big-button'>
                                { !loading && <span>Update</span> }
                                { loading && <span disabled>Updating...</span> }
                            </button>
                            {/* <button className='button delete-button' onClick={handleDelete}>
                                <MdDelete className='icon'/>
                            </button> */}
                        </div>
                    </form>
                </div>
                }





            <SearchSystem
                elements={userShops}
                Card={Card}
                name='shops'
                searchValue={search}
            />
        </div>
    )
}

export default User