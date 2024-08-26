import { useState } from 'react'
import { useDatabase } from '../contexts/DatabaseContext'
import { useAuth } from '../contexts/AuthContext'
import ItemCard from '../components/ItemCard'
import ShopCard from '../components/ShopCard'
import SearchSystem from '../components/SearchSystem'
import Navbar from '../components/Navbar'
import SlideSystem from '../components/SlideSystem'
import Footer from '../components/Footer'
import ItemLogo from '../images/item_default1.png'

const Home = () => {
    const { users, items, shops, categories } = useDatabase()
    const { currentUser } = useAuth()
    const [search, setSearch] = useState('')

    const SHOP_COUNT_LIMIT = 15
    var displayShops = shops
    const displayItems = items


    // Card functions
    const CardItem = (item) => {
        return (
            <ItemCard
                item={item}
                show={true}
                shopStyle={{ item: '3' }}
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

    var likedItems = []
    if (currentUser) {
        likedItems = displayItems.filter(item => {
            const likes = JSON.parse(item.likes)
            if (!likes) return false
            return likes.includes(currentUser.id)
        })
    }
    

    return (
        <div className='page home-page'>
            <Navbar searchAction={setSearch} />
            <div className='shop-list expand-content'>
                { !search && likedItems.length > 0 &&
                <div className='liked-products'>
                    <SlideSystem
                        elements={likedItems}
                        card={CardItem}
                        title={'Liked products'}
                    />
                </div>
                }


                { displayShops.filter( element => itemsClassified[element.id] )
                .map((element, index) => (
                    <SlideSystem
                        key={index}
                        elements={itemsClassified[element.id]}
                        card={CardItem}
                        title={element.name}
                        titleImage={element.logo}
                        link={`/shop/${element.id}`}
                    />
                ))}
            </div>
            <Footer/>
        </div>
    )
}

export default Home