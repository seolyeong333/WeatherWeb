import 'bootstrap/dist/css/bootstrap.min.css'; // 부트스트랩 CSS 추가

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <App />
)
