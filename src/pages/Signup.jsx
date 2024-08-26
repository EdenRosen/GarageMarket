import { useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AlertMessage from '../components/AlertMessage'
import { Link, useNavigate } from 'react-router-dom'
import { TextField } from '@mui/material';
import { useDatabase } from '../contexts/DatabaseContext'
import axios from '../services/api'
import logoImage from '../images/logo1.png'


const Signup = () => {
    const { refetch } = useDatabase()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const { loginWithGoogle } = useAuth()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async e => {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setErrorMessage('Passwords do not match')
            return
        }

        setLoading(true)

        // upload to database
        const firstName = firstNameRef.current.value
        const lastName = lastNameRef.current.value
        const name = lastName == '' ? firstName : firstName + ' ' + lastName
        const user = {
            name,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }
        
        axios.post(
            `register`,
            user,
        ).then(() => {
            refetch()
            navigate(`/`)
        }).catch(e => {
            const res = e.response?.data
            if (!res) {
                console.log(e);
                return
            }
            setErrorMessage(res)
        }).finally(() => {
            setLoading(false)
        })
    }
    
    const handleGoogleAuth = () => {
        loginWithGoogle().then(() => {
            refetch()
            navigate('/')
        })
    }

    return (
        <div className='login-page'>
            <div className='logo'>
                <Link to='/'>
                    <img src={logoImage} alt=''/>
                </Link>
            </div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className='full-name-input'>
                    <TextField
                        className='input-field'
                        label="First name"
                        type='text'
                        inputRef={firstNameRef}
                    />
                    <TextField
                        className='input-field'
                        label="Last name"
                        type='text'
                        inputRef={lastNameRef}
                    />
                </div>
                <TextField
                    className='input-field'
                    label="Email"
                    type='text'
                    inputRef={emailRef}
                />
                <TextField
                    className='input-field'
                    label="Password"
                    type='password'
                    inputRef={passwordRef}
                />
                <TextField
                    className='input-field'
                    label="Confirm password"
                    type='password'
                    inputRef={passwordConfirmRef}
                />
                { errorMessage && <AlertMessage text={ errorMessage } /> }
                <button className='button login-button'>
                    { !loading && <span>Sign Up</span> }
                    { loading && <span disabled>Signing Up...</span> }
                </button>
                <div>Already have an account? <Link className='regular-link' to='/login'>Log In</Link></div>
                <div className='or-line'><span>or</span></div>
                <div className='g-sign-in-button' onClick={handleGoogleAuth}>
                    <img src='https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png'/>
                    <span>Sign up with Google</span>
                </div>
            </form>
        </div>
    )
}

export default Signup