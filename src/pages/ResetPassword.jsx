import { useRef, useState } from 'react'
import AlertMessage from '../components/AlertMessage'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { TextField } from '@mui/material'
import axios from '../services/api'
import logoImage from '../images/logo1.png'

const ResetPassword = () => {
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const handleSubmit = async e => {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setErrorMessage('Passwords do not match')
            return
        }
        setLoading(true)

        // upload to database
        
        const token = searchParams.get('token')
        axios.patch(
            `reset-password?token=${token}`,
            { password: passwordRef.current.value },
        ).then(() => {
            navigate(`/login`)
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

    return (
        <div className='login-page'>
            <div className='logo'>
                <Link to='/'>
                    <img src={logoImage} alt=''/>
                </Link>
            </div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
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
                <button className='button'>
                    { !loading && <span>Reset password</span> }
                    { loading && <span disabled>Resetting password...</span> }
                </button>
            </form>
        </div>
    )
}

export default ResetPassword