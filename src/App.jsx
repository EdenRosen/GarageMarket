import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import User from './pages/User'
import Users from './pages/Users'
import Shop from './pages/Shop'
import ShopAbout from './pages/ShopAbout'
import Shops from './pages/Shops'
import Item from './pages/Item'
import Items from './pages/Items'
import CreateShop from './pages/CreateShop'
import CreateItem from './pages/CreateItem'
import CreateCollection from './pages/CreateCollection'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from'./pages/ResetPassword'
import './styles/components.css'
import './styles/pages.css'
import './styles/shop.css'

function App() {
  const { currentUser } = useAuth()
  
  return (
    <div className="App">
      <div className="content">
        <Routes>
          <Route path="/" element={<Home/>} />
          
          { !currentUser && <Route path="/login" element={<Login/>} /> }
          { !currentUser && <Route path="/signup" element={<Signup/>} /> }
          { !currentUser && <Route path="/forgot-password" element={<ForgotPassword/>} /> }
          { !currentUser && <Route path="/reset-password" element={<ResetPassword/>} /> }
          { currentUser && <Route path="/create-shop" element={<CreateShop/>} /> }
          { currentUser && <Route path="/shop/:id/create-item" element={<CreateItem/>} /> }
          { currentUser && <Route path="/shop/:id/create-collection" element={<CreateCollection/>} /> }
          
          <Route path="/users" element={<Users/>} />
          <Route path="/user/:id" element={<User/>} />
          <Route path="/shops" element={<Shops/>} />
          <Route path="/shop/:id" element={<Shop/>} />
          <Route path="/shop/:id/about" element={<ShopAbout/>} />
          <Route path="/items" element={<Items/>} />
          <Route path="/item/:id/show" element={<Item show={true}/>} />
          <Route path="/item/:id" element={<Item/>} />
          
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
