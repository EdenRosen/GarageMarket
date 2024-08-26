import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye } from "react-icons/fa"
import { FaEyeSlash } from "react-icons/fa6"
import { TextField, FormControl, OutlinedInput, InputLabel, InputAdornment,
    IconButton  } from '@mui/material';
import { useAuth } from '../contexts/AuthContext'
import { useDatabase } from '../contexts/DatabaseContext'
import AlertMessage from '../components/AlertMessage'
import axios from '../services/api'
import logoImage from '../images/logo1.png'

const Login = () => {
    const { refetch } = useDatabase()
    const emailRef = useRef()
    const passwordRef = useRef()
    const { loginWithGoogle, login } = useAuth()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()

        const password = passwordRef.current.value
        const emailInput = emailRef.current.value
        const email = emailInput.includes('@') ? emailInput : emailInput + '@gmail.com'


        if (!emailInput) {
            setErrorMessage('Please provide your email')
            return
        }
        if (!password) {
            setErrorMessage('Please provide your password')
            return
        }

        setLoading(true)
        
        axios.post(
            `login`,
            { email },
        ).then(res => {
            if (!res.data.emailVerified) {
                setErrorMessage('Check your email inbox')
                setLoading(false)
                return
            }

            login(email, password).then(res => {
                navigate('/')
            }).catch(e => {
                setErrorMessage('Wrong email or password')
            }).finally(() => {
                setLoading(false)
            })

        }).catch(e => {
            const res = e.response.data
            setErrorMessage(res.message)
            setLoading(false)
        })
    }

    const handleGoogleAuth = () => {
        loginWithGoogle().then(() => {
            refetch()
            navigate('/')
        })
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const handleMouseDownPassword = (event) => event.preventDefault()

    return (
        <div className='page login-page'>
            <div className='logo'>
                <Link to='/'>
                    <img src={logoImage} alt=''/>
                </Link>
            </div>
            <form onSubmit={handleSubmit}>
                <TextField
                    className='input-field'
                    label="Email"
                    type='text'
                    inputRef={emailRef}
                />
                <FormControl variant="outlined" className='input-field'>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            className='.not-button'
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Password"
                        inputRef={passwordRef}
                    />
                </FormControl>
                { errorMessage && <AlertMessage text={ errorMessage } /> }
                <button className='button login-button'>
                    { !loading && <span>Sign In</span> }
                    { loading && <span disabled>Signing In...</span> }
                </button>
                <div className='d-row'>
                    <Link className='regular-link' to='/forgot-password'>Forgot password?</Link>
                    <div>Need an account? <Link className='regular-link' to='/signup'>Sign Up</Link></div>
                </div>
                <div className='or-line'><span>or</span></div>
                <div className='g-sign-in-button' onClick={handleGoogleAuth}>
                    <img src='https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png'/>
                    <span>Sign in with Google</span>
                </div>
            </form>
        </div>
    )
}

export default Login