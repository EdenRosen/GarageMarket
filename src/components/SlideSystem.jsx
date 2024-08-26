import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { imageBufferToUrl } from '../utils/imageHandle'

const SlideSystem = ({ elements, card, title, titleImage=null, link='' }) => {
    const imageURL = imageBufferToUrl(titleImage)
    

    return (
        <div className='slide-system'>
            <div className='title-info'>
                <Link to={link}>
                    { imageURL && <img src={imageURL} alt='' /> }
                    { !imageURL && <label>{title}</label> }
                </Link>
            </div>
            <div className='element-list'>
                { elements.map(element => (
                    <div key={element.id}>
                        { card(element) }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SlideSystem