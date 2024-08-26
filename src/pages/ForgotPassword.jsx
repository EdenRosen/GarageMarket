import { useRef, useState } from 'react'
import AlertMessage from '../components/AlertMessage'
import { Link } from 'react-router-dom'
import { TextField } from '@mui/material'
import axios from '../services/api'
import logoImage from '../images/logo1.png'

const ForgotPassword = () => {
    const emailRef = useRef()
    const [errorMessage, setErrorMessage] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()

        setLoading(true)

        axios.post(
            `forgot-password`,
            { email: emailRef.current.value },
        ).then(res => {
            setMessage('Verification email was sent. Check your inbox')
            setErrorMessage('')
        }).catch(e => {
            const res = e.response?.data
            if (!res) {
                console.log(e);
                return
            }
            setErrorMessage(res.message)
        }).finally(() => {
            setLoading(false)
        })
        
    }

    return (
        <div className='login-page'>
            <div className='logo'>
                <Link to='/'>
                    <img src={logoImage} alt=''/>
                </Link>
            </div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    className='input-field'
                    label="Email"
                    type='text'
                    inputRef={emailRef}
                />
                { errorMessage && <AlertMessage text={ errorMessage } /> }
                { message && <p>{ message }</p> }
                <button className='button'>
                    { !loading && <span>Send email</span> }
                    { loading && <span disabled>Sending email...</span> }
                </button>
                <div>Just remembered the password? <Link className='regular-link' to='/login'>Log In</Link></div>
            </form>
        </div>
    )
}

export default ForgotPassword