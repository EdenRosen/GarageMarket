import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import logoImage from '../images/logo1.png'
import { IoMenu } from "react-icons/io5"
import { FaUserCircle } from "react-icons/fa"
import { FaSearch } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import SearchBar from './SearchBar'


const Navbar = ({ searchAction }) => {
    const { currentUser } = useAuth()
    const [dropdownMenu, setDropdownMenu] = useState(false)

    const handleMenu = () => {
        setDropdownMenu(!dropdownMenu)
    }
    

    return (
        <div className='nav-wrapper'>
            <nav className="navbar">
                <div className='logo'>
                    <Link to='/'>
                        <img src={logoImage} alt=''/>
                    </Link>
                </div>
                
                <SearchBar searchAction={searchAction} />
                <div className="links">
                    { !currentUser && <NavLink to="/login"><FaUserCircle/></NavLink> }
                    { currentUser && <NavLink to="/user/me"><FaUserCircle/></NavLink> }
                    <div className='menu-button' onClick={handleMenu}><IoMenu/></div>
                </div>
            </nav>
            <div className={`menu-container ${dropdownMenu ? 'open' : ''}`}>
                <div className="menu-links">
                    <NavLink to="/">Home</NavLink>
                    { !currentUser && <NavLink to="/login">Login</NavLink> }
                    { currentUser && <NavLink to="/user/me">Profile</NavLink> }
                    <NavLink to="/items">Items</NavLink>
                    <NavLink to="/shops">Shops</NavLink>
                    <NavLink to="/users">Users</NavLink>
                </div>    
            </div>
        </div>
        
    )
}

export default Navbar