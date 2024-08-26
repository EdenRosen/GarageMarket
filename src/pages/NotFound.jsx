import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='page not-found'>
            <h3>Sorry, this page isn't available</h3>
            <Link to="/">Go back to Home page</Link>
        </div>
    )
}
 
export default NotFound