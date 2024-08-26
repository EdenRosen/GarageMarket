import { useState } from 'react'
import UserCard from '../components/UserCard'
import SearchSystem from '../components/SearchSystem'
import { useDatabase } from '../contexts/DatabaseContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Users = () => {
    const { items, shops, users, categories } = useDatabase()
    const [search, setSearch] = useState('')

    const Card = (user) => {
        return (
            <UserCard user={user} />
        )
    }
    
    return (
        <div className='page'>
            <Navbar searchAction={setSearch} />
            <div className='expand-content'>
                <h1 className='title'>Users</h1>
                <SearchSystem
                    elements={users}
                    Card={Card}
                    name='users'
                    searchValue={search}
                />
            </div>
            <Footer/>
        </div>
    )
}

export default Users