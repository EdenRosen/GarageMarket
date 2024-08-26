import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { IoIosHome } from "react-icons/io"
import { IoSearch } from "react-icons/io5"
import { FiX } from "react-icons/fi"
import { imageBufferToUrl } from '../utils/imageHandle'
import { getContrastYIQ } from '../utils/colorHandle'

const ShopNavbar = ({ shop, color='#FFFFFF', message='message1', showHome=true, searchAction, collection=null }) => {
    const imageURL = imageBufferToUrl(shop.logo)
    const textColor = getContrastYIQ(color)
    const [searchBar, setSearchBar] = useState(false)
    const [search, setSearch] = useState('')
    const [dropdownMenu, setDropdownMenu] = useState(false)
    const [currentCollection, setCurrentCollection] = useState(null)

    const handleMenu = () => {
        if (searchBar && !dropdownMenu) {
            setSearchBar(!searchBar)
        }
        setDropdownMenu(!dropdownMenu)
    }

    const handleSearchBar = () => {
        if (!searchBar && dropdownMenu) {
            setDropdownMenu(!dropdownMenu)
        }
        setSearchBar(!searchBar)
    }
    
    const handleSearch = value => {
        setSearch(value)
        searchAction(value)
    }

    if (currentCollection != collection) {
        setDropdownMenu(false)
        setCurrentCollection(collection)
    }

    const shopStyle = JSON.parse(shop.style)
    const collections = shopStyle?.collections ? shopStyle.collections : []

    return (
        <header className='shop-nav-wrapper'>
            <div className='shop-upper'>
                { message &&
                    <div className='shop-message'>{ message }</div>
                }
                <nav
                    className={`shop-navbar ${
                        (color === '#FFFFFF') ? 'white-class':''
                    }`}
                    style={{ backgroundColor: color }}
                >
                    <div className='left'>
                        { collections.length > 0 &&
                            <div className={textColor} onClick={handleMenu}>Collections</div>
                        }
                        <NavLink to={`/shop/${shop.id}/about`} className={textColor}>About Us</NavLink>
                    </div>
                    <div className='logo'>
                        <Link to={`/shop/${shop.id}`}>
                            { imageURL ?
                                <img src={imageURL} alt='' />
                                : <h1>{ shop.name }</h1>
                            }
                        </Link>
                    </div>
                    <div className='right'>
                        <div className={textColor} onClick={handleSearchBar}><IoSearch/></div>
                        { showHome && <NavLink to="/" className={textColor}><IoIosHome/></NavLink> }
                    </div>
                </nav>
            </div>
            <div className={`shop-search-bar ${searchBar ? 'open' : ''}`}>
                <input
                    placeholder='Search'
                    value={search}
                    onChange={e => handleSearch(e.target.value)}
                />
                <div className='exit-icon' onClick={() => setSearchBar(!searchBar)}><FiX /></div>
            </div>
            <div className={`menu-container ${dropdownMenu ? 'open' : ''}`}>
                <div className="menu-links">
                    <NavLink to={`/shop/${shop.id}`}>All</NavLink>
                    {
                    collections.map((e, i) => {
                        if (e == collection) return <NavLink key={i} className='current' to={`/shop/${shop.id}/?collection=${e}`}>{e}</NavLink>
                        return <NavLink key={i} to={`/shop/${shop.id}/?collection=${e}`}>{e}</NavLink>
                    })
                    }
                </div>    
            </div>
        </header>
    )
}

export default ShopNavbar