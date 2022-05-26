import * as effects from '@effects'

import Navbar from '@components/Navbar'
import Home from '@routes/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'

const App = () => {
    
    effects.useDebugEffect()
    
    return (
        
        <Router>
            
            <div className="App scrollbar-minimal">
                
                <Navbar />
                
                <article>
                    <Routes>
                        <Route exact path="/" element={<Home />} />
                    </Routes>
                </article>
                
            </div>
            
        </Router>
        
    )
    
}

export default App
