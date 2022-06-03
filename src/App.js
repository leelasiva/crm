import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { Suspense } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import Login from './pages/Login';

function App() {
  return (
<Router>
<Routes>
<Route  path="/" element={
  <Suspense fallback={<div>Loading...</div>}>
  <Login/>
  </Suspense>
}/>

</Routes>

</Router>
  );
}

export default App;
