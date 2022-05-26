import ReactDOM from 'react-dom'
import '@styles/index.css'
import { NS } from '@constants'
import { setNamespace } from 'react-wire-persisted'
import App from '@components/App'

setNamespace(NS)

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
)
