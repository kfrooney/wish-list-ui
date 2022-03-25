import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import App from './App';
import firebaseConfig from './firebase-config';
import { initializeApp } from "firebase/app";
import { useEffect, useState } from 'react';
import { getAuth, User } from 'firebase/auth';

function WishListRoutes() {
  initializeApp(firebaseConfig);
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    return auth.onAuthStateChanged((user: User | null) => {
      setUser(user);
    });
  })
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<div>This is a static intro page. Try going to <a href="login">login</a> or <a href="app">app</a></div>}></Route>
      <Route path="app" element={<App user={user} />}></Route>
      <Route path="login" element={<Login user={user} />}></Route>
      <Route path="*" element={<div>Not Found</div>}></Route>
    </Routes>
  </BrowserRouter>;
}

export default WishListRoutes;