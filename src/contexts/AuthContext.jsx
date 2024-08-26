import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,

} from 'firebase/auth'
import { useCookies } from 'react-cookie'
import axios from '../services/api'


const AuthContext = createContext()

const useAuth = () => useContext(AuthContext)

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['jwt_authorization'])
    

    function getToken() {
        return cookies['jwt_authorization']
    }

    async function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    
    async function loginWithGoogle() {
        await signInWithPopup(auth, new GoogleAuthProvider())
        .then((result) => {
            // const credential = GoogleAuthProvider.credentialFromResult(result)
            const user = result.user
            user.getIdToken().then(token => {
                axios.post(
                    `register-google`,
                    { email: user.email },
                    { headers: { Authorization: `Bearer ${token}` } },
                ).then(() => {
                    return true
                }).catch(() => {
                    return false
                })
            })
        }).catch((error) => {
            // Handle Errors here.
            // const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorMessage, email, credential);
            return false
        })
    }

    function logout() {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                axios.get(
                    'users'
                )
                .then(res => {
                    const users = res.data
                    var appUser = users.find(e => e.email === user.email)
                    appUser.uid = user.uid
                    setCurrentUser(appUser)
                    user.getIdToken().then(token => {
                        setCookie('jwt_authorization', token, { path: '/', maxAge: 2 * 60 * 60 })
                    })
                })
                .catch(err => {
                    console.log(err);
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setCurrentUser(null)
                removeCookie('jwt_authorization')
                setLoading(false)
            }
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        const refreshToken = () => {
            setLoading(true)
            const user = auth.currentUser
            
            if (user) {
                user.getIdToken().then(token => {
                    setCookie('jwt_authorization', token, { path: '/', maxAge: 2 * 60 * 60 })
                }).catch((error) => {
                    console.error('Error refreshing token:', error)
                }).finally(() => {
                    setLoading(false)
                })
            } else {
                setCurrentUser(null)
                removeCookie('jwt_authorization')
                setLoading(false)
            }
        }
    
        const intervalId = setInterval(refreshToken, 20 * 50 * 1000)
        return () => clearInterval(intervalId)
    }, [])
    

    const value = {
        currentUser,
        getToken,
        login,
        loginWithGoogle,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export { useAuth, AuthProvider }