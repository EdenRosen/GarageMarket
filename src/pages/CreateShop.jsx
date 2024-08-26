import {  useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io"
import { TextField } from '@mui/material';
import { useDatabase } from '../contexts/DatabaseContext'
import { useAuth } from '../contexts/AuthContext'
import AlertMessage from '../components/AlertMessage'
import Navbar from '../components/Navbar'
import axios from '../services/api'

const CreateShop = () => {
    const nameRef = useRef()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    const { refetch, items, shops, users, categories } = useDatabase()
    const { currentUser, getToken } = useAuth()

    const user = users.find(e => e.email === currentUser.email)


    const handleSubmit = (e) => {
        e.preventDefault()

        const name = nameRef.current.value
        const shopFound = shops.find(shop => shop.name === name)

        if (shopFound) {
            setErrorMessage(`Shop name "${name}" is already Taken`)
            return
        }

        const shop = {
            UserId: user.id,
            name,
            location: null,
            image: null,
            style: '{}',
            texts: '{}',
        }
        
        setLoading(true)
        axios.post(
            `shops`,
            shop,
            { headers: { Authorization: `Bearer ${getToken()}` } },
        ).then(res => {
            console.log(res.data);
            const newShop = res.data
            refetch()
            navigate(`/shop/${newShop.id}`)
            setLoading(false)
        }).catch(e => {
            console.log(e);
        })
    }

    // handle functions
    const navigateBack = () => navigate(`/user/${user.id}`)

    return (
        <div className='page'>
            <Navbar/>
            <div className='back-button-container'>
                <div className='back-button' onClick={navigateBack}>
                    <IoIosArrowBack/>
                </div>
            </div>
            <h1>New Shop</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    className='input-field'
                    label="Shop name"
                    type='text'
                    inputRef={nameRef}
                />
                { errorMessage && <AlertMessage text={ errorMessage } /> }
                <button className='button'>
                    { !loading && <span>Create</span> }
                    { loading && <span disabled>Creating...</span> }
                </button>
            </form>
        </div>
    )
}
 
export default CreateShop