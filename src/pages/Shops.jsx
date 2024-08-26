import { useState } from 'react'
import ShopCard from '../components/ShopCard'
import SearchSystem from '../components/SearchSystem'
import { useDatabase } from '../contexts/DatabaseContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Shops = () => {
    const { items, shops, users, categories } = useDatabase()
    const [search, setSearch] = useState('')

    const SHOP_COUNT_LIMIT = 100
    var displayShops = shops
    const displayItems = items

    const Card = (shop) => {
        return (
            <ShopCard shop={shop}
                user={users.find(user => user.id === shop.userId)}
            />
        )
    }
    
    var itemsClassified = {}
    for (const item of displayItems) {
        if (itemsClassified[item.ShopId] === undefined) {
            itemsClassified[item.ShopId] = [item]
        } else {
            itemsClassified[item.ShopId].push(item)
        }
    }
    for (const key of Object.keys(itemsClassified)) {
        const shop = shops.find(shop => shop.id == key)
        const shopFound = shop.name.toLowerCase().includes(search.toLowerCase())
        const itemFound = itemsClassified[key].find(item => {
            return item.name.toLowerCase().includes(search.toLowerCase())
        })
        if (!shopFound && !itemFound) {
            delete itemsClassified[key]
        }
    }

    displayShops = displayShops.sort((a,b) => {
        var aLikes = 0
        var bLikes = 0
        if (itemsClassified[a.id] == undefined) return 1
        if (itemsClassified[b.id] == undefined) return -1
        itemsClassified[a.id].forEach(item => {
            const likeList = JSON.parse(item.likes) || []
            aLikes += likeList.length
        })
        itemsClassified[b.id].forEach(item => {
            const likeList = JSON.parse(item.likes) || []
            bLikes += likeList.length
        })
        return aLikes < bLikes ? 1 : -1
    })

    if (displayShops.length > SHOP_COUNT_LIMIT) {
        displayShops = displayShops.slice(0, SHOP_COUNT_LIMIT)
    }
    
    return (
        <div className='page'>
            <Navbar searchAction={setSearch} />
            <div className='expand-content'>
                <h1 className='title'>Shops</h1>
                { shops && users &&
                <SearchSystem
                    elements={displayShops}
                    Card={Card}
                    name='shops'
                    searchValue={search}
                />
                }
            </div>
            <Footer/>
        </div>
    )
}

export default Shops