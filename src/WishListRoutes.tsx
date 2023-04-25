import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import App from './App';

function WishListRoutes() {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>This is a static intro page. Try going to <a href="login">login</a> or <a href="app">app</a></div>}></Route>
      <Route path="app" element={<App/>}></Route>
      <Route path="login" element={<Login/>}></Route>
      <Route path="*" element={<div>Not Found</div>}></Route>
    </Routes>
  </BrowserRouter>;
}

export default WishListRoutes;