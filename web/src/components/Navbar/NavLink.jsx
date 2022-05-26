import cn from 'classnames'

import { Link } from 'react-router-dom'

const NavLink = ({
    className,
    children,
    ...props
}) => {
    
    return (
        
        <Link
            className={cn(
                'NavLink', {
                    [className]: className,
                }
            )}
            {...props}>
            {children}
        </Link>
        
    )
    
}

export default NavLink
