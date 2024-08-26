import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from '../services/api'

const useFetch = (url) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { currentUser, getToken } = useAuth()

    const fetchData = useCallback(() => {
        const abortCont = new AbortController()
        setLoading(true)
        setTimeout(() => {
            axios.get(
                url,
                {
                    signal: abortCont.signal,
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            )
            .then(res => {
                const data = res.data
                setData(data)
                setLoading(false)
                setError(null)
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setLoading(false)
                    setError(err.message)
                }
            })
        }, 0)

        return () => abortCont.abort()
    }, [url])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}

export default useFetch