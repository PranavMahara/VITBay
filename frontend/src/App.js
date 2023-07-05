import './App.css';
import React, { useState, useEffect } from 'react'
import Navbar from "./component/layout/Navbar/Navbar.js"
import { Route, Routes, BrowserRouter } from "react-router-dom"
import Footer from './component/layout/Footer/Footer';
import WebFont from 'webfontloader';
import Home from "./component/Home/Home";
import ProductDetails from './component/Product/ProductDetails';
import Products from './component/Product/Products';
import Search from './component/Product/Search';
import About from "./component/layout/About/About"
import LoginSignup from "./component/User/LoginSignUp"
import Profile from "./component/User/Profile"
import SignUp from './component/User/SignUp';
import store from './store';
import { loadUser } from './actions/userAction';
import ProtectedRoute from './component/ProtectedRoute';
import UpdateProfile from './component/User/UpdateProfile';
import UpdatePassword from './component/User/UpdatePassword';
import ForgotPassword from './component/User/ForgotPassword';
import ResetPassword from './component/User/ResetPassword';
import NotFound from "./component/layout/NotFound/NotFound";
import Cart from './component/Cart/Cart';
import Shipping from "./component/Cart/Shipping"
import ConfirmOrder from './component/Cart/ConfirmOrder';
import Payment from "./component/Cart/Payment"
import axios from "axios"

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault());
  return (

    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/register" element={<SignUp />} />
        <Route exact path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route exact path="/me/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
        <Route exact path="/password/update" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route exact path="*" element={<NotFound />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path='/shipping' element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
        <Route exact path='/order/confirm' element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute>} />
        {/* {stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Route exact path="/process/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          </Elements>
        )} */}
        <Route exact path="/process/payment" element={<Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute><Payment /></ProtectedRoute>
        </Elements>} />

      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
