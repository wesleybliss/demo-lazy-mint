import cn from 'classnames'

import { Link } from 'react-router-dom'
import NavLink from './NavLink'

import './Navbar.css'

const Navbar = ({
    
}) => {
    
    return (
        
        <nav className="Navbar">
            
            <div className="flex items-center content-center flex-grow h-full">
                <Link
                    className="branding"
                    to="/">
                    {document.title?.toUpperCase() ?? ''}
                </Link>
            </div>
            
            <div className="flex items-center content-center">
                
                <NavLink to="/">&nbsp;</NavLink>
                
            </div>
            
        </nav>
        
    )
    
}

export default Navbar
