import { createContext, useContext, useState, useEffect } from 'react'
import useFetch from '../hooks/useFetch'

const DatabaseContext = createContext()

const useDatabase = () => {
    return useContext(DatabaseContext)
}

const DatabaseProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const db_url = import.meta.env.VITE_DATABASE_URL
    const { data: usersFetched, loading: l1, error: e1, refetch: refetchUsers } = useFetch(db_url+'/users')
    const { data: shopsFetched, loading: l2, refetch: refetchShops } = useFetch(db_url+'/shops')
    const { data: itemsFetched, loading: l3, refetch: refetchItems } = useFetch(db_url+'/items')
    const { data: categoriesFetched, loading: l4, refetch: refetchCategories } = useFetch(db_url+'/categories')
    const [items, setItems] = useState()
    const [shops, setShops] = useState()
    const [users, setUsers] = useState()
    const [categories, setCategories] = useState()

    useEffect(() => {
        const ready = !(l1 || l2 || l3 || l4)
        if (e1) {
            setError(true)
        }
        if (ready) {
            setItems(itemsFetched)
            setShops(shopsFetched)
            setUsers(usersFetched)
            setCategories(categoriesFetched)
            setLoading(false)
        }
    }, [
        l1, l2, l3, l4,
        e1,
        usersFetched, shopsFetched, itemsFetched, categoriesFetched,
    ])

    const refetch = () => {
        setLoading(true)
        refetchUsers()
        refetchShops()
        refetchItems()
        refetchCategories()
    }
    

    const value = {
        items,
        shops,
        users,
        categories,
        refetch
    }

    return (
        <DatabaseContext.Provider value={value}>
            { !loading && !error && children }
            { loading && <div>Loading...</div> }
            { error && <div>Network Error, sorry</div> }
        </DatabaseContext.Provider>
    )
}

export { useDatabase, DatabaseProvider }