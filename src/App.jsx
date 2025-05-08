import  {BrowserRouter, Routes, Route} from 'react-router-dom'
import LoginPage from './assets/Pages/LoginPage'
import './index.css'
import Users from './assets/Pages/Users' 
import DashboardPage from './assets/Pages/DashboardPage'
import Moreinfo from './assets/Pages/Moreinfo'
import Sample from './assets/Pages/Sample'
import SampleList from './assets/components/sample/SampleList'
import AnalysisPage from './assets/Pages/AnalysisPage'
import Analysis from './assets/components/analysis/analysis'
function App() {
  return (
  <div className="Contianer text-black">
     <BrowserRouter>
       <Routes>
         <Route path ="/" element={<LoginPage/>}/>
         <Route path ="/dashboard" element={<DashboardPage/>}/>
         <Route path="/sample/moreinfo" element={<Moreinfo />} />
         <Route path ="/users" element={<Users/>}/>
         <Route path = "/sample" element={<Sample/>} />
         <Route path = "/analysis" element={<AnalysisPage/>} />
         <Route path = "/analysis/result" element={<Analysis/>} />
         
     </Routes>
     </BrowserRouter>
  </div>

  )
}

export default App
