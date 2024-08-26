import { Link } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa"
import { FaGithub } from "react-icons/fa"


export default function Footer() {
  return (
    <div className='footer'>
      <div className='content'>
        <a href= "mailto:edenbusiness500@email.com">
          <div className='icon-link'><FaGoogle /></div>
        </a>
        <Link to={'https://edenrosen.github.io'}>
          <div className='icon-link'><FaGithub /></div>
        </Link>
      </div>
      <div className='bottom'>
        <span className='copyright'>© 2024 Copyright: </span>
        <span className='url'>GarageMarket.com</span>
      </div>
    </div>
  )
}