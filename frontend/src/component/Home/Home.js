import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import "./Home.css";
import { clearErrors, getProduct } from '../../actions/productsAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import coverImage from "../../images/cover.jfif";

export const categories = [
    ["Laptop", "Laptops"],
    ["SmartPhones", "Phones"],
    ["Camera", "Cameras"],
    ["Books", "Books"],
    ["Hostel", "Hostel essentials"],
    ["Footwear", "Footwear"],
    ["Tops", "Tops"],
    ["Bottom", "Bottoms"],
    ["Attire", "Jackets & hoodies"],
];

export default function Home() {
    const alert = useAlert()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState("")

    const { loading, error, products } = useSelector((state) => state.products)

    useEffect(() => {
        dispatch(getProduct())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [dispatch, error, alert])

    const search = (e) => {
        e.preventDefault()
        navigate(keyword.trim() ? `/products/${keyword.trim()}` : "/products")
    }

    return (
        <Fragment>
            <section className="hero">
                <div className="heroText">
                    <p className="heroKicker">from students, for students</p>
                    <h1>Buy it. Sell it.<br />Pass it on.</h1>
                    <p className="heroSub">
                        VITBay is where students on campus trade laptops, books, cameras, clothes and hostel
                        essentials with each other. Nothing new, nothing shipped. Just a short walk away.
                    </p>
                    <form className="heroSearch" onSubmit={search}>
                        <input
                            type="text"
                            placeholder="What are you looking for? e.g. calculator, kettle, DSLR"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button type="submit">Search</button>
                    </form>
                    <p className="heroPopular">
                        Popular:{" "}
                        <Link to="/products?category=Laptop">Laptops</Link>
                        <Link to="/products?category=SmartPhones">Phones</Link>
                        <Link to="/products?category=Books">Books</Link>
                        <Link to="/products?category=Hostel">Hostel essentials</Link>
                    </p>
                </div>
                <div className="heroImage">
                    <img src={coverImage} alt="A laptop glowing in a dark room" />
                </div>
            </section>

            <section className="homeSection">
                <div className="banner">
                    <h2>Browse by category</h2>
                </div>
                <ul className="categoryRow">
                    {categories.map(([value, label]) => (
                        <li key={value}><Link to={`/products?category=${value}`}>{label}</Link></li>
                    ))}
                </ul>
            </section>

            <section className="homeSection">
                <div className="banner">
                    <h2>Fresh on campus</h2>
                    <p>Latest listings from students near you</p>
                </div>
                {loading ? <Loader /> : (
                    <div className="container" id="container">
                        {products && products.slice(0, 8).map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
                <div className="seeAll"><Link to="/products">See all listings</Link></div>
            </section>

            <section className="homeSection how">
                <div className="banner">
                    <h2>How VITBay works</h2>
                </div>
                <ol className="steps">
                    <li>
                        <span>1</span>
                        <h3>List it</h3>
                        <p>Take a couple of photos, set a price and say where on campus you can meet.</p>
                    </li>
                    <li>
                        <span>2</span>
                        <h3>Get in touch</h3>
                        <p>Browse what your seniors and batchmates are selling, then contact the seller.</p>
                    </li>
                    <li>
                        <span>3</span>
                        <h3>Meet and swap</h3>
                        <p>Check the item in person at a spot you both know, pay, and you're done.</p>
                    </li>
                </ol>
            </section>

            <section className="sellBand">
                <div>
                    <h2>Something gathering dust in your room?</h2>
                    <p>Last year's textbooks, a spare kettle, a bike you no longer ride. Someone on campus needs it.</p>
                </div>
                <Link to="/sell" className="sellBandBtn">Post a listing</Link>
            </section>
        </Fragment>
    )
}
