import  {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './assets/Pages/LoginPage'
import './index.css'
import Users from './assets/Pages/Users' 
import DashboardPage from './assets/Pages/DashboardPage'
import Sample from './assets/Pages/Sample'
function App() {
  return (
  <div className="Contianer text-black">
     <BrowserRouter>
       <Routes>
         <Route path ="/" element={<LoginPage/>}/>
         <Route path ="/dashboard" element={<DashboardPage/>}/>
         <Route path ="/users" element={<Users/>}/>
         <Route path = "/sample" element={<Sample/>} />
         
     </Routes>
     </BrowserRouter>
  </div>

  )
}

export default App
