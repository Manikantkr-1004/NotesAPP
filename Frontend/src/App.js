import {Text} from "@chakra-ui/react"
import './App.css';
import { AllRoutes } from './Routes/AllRoutes';
import { Navbar } from './Routes/Navbar';

function App() {


  return (
    <div className="App">
      <Navbar />
      <AllRoutes />
      <Text textAlign="center" mt="40px" fontWeight="500" >Created by <span style={{color:"blue"}}>Manikant kumar...</span></Text>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </div>
  );
}

export default App;
