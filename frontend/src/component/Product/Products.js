import React, { useEffect, useState } from 'react'
import "./Products.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productsAction'
import Loader from '../layout/Loader/Loader'
import ProductCard, { rupees } from '../Home/ProductCard'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import { Slider, Typography } from '@mui/material'
import { useAlert } from "react-alert"

const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
];

export default function Products({ match }) {
    const { keyword } = useParams()
    const dispatch = useDispatch()
    const alert = useAlert()

    const [currentPage, setcurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 100000])
    const [searchParams] = useSearchParams()
    const [category, setCategory] = useState(searchParams.get("category") || "")
    const [ratings, setRatings] = useState(0)
    const [condition, setCondition] = useState("")
    const urlCategory = searchParams.get("category") || ""

    useEffect(() => { setCategory(urlCategory); setcurrentPage(1) }, [urlCategory])

    const { products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector((state) => state.products)

    const setCurrentPageNo = (e) => {
        setcurrentPage(e)
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice)
    }

    let count = filteredProductsCount;

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, alert, error]);

    useEffect(() => {
        dispatch(getProduct(keyword, currentPage, price, category, ratings, condition));
    }, [dispatch, keyword, currentPage, price, category, ratings, condition]);

    const categoryList = [
        ["Laptop", "Laptops"], ["SmartPhones", "Phones"], ["Camera", "Cameras"], ["Books", "Books"],
        ["Hostel", "Hostel essentials"], ["Footwear", "Footwear"], ["Tops", "Tops"], ["Bottom", "Bottoms"], ["Attire", "Jackets & hoodies"],
    ];
    const conditions = ["Like new", "Good", "Fair"];
    const title = keyword
        ? `Results for “${keyword}”`
        : category ? (categoryList.find(([v]) => v === category) || [0, category])[1] : "All listings";

    return (
        <div className="shopPage">
            <aside className="filterBox">
                <Typography className="filterTitle">Price</Typography>
                <Slider
                    value={price}
                    onChange={priceHandler}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    min={0}
                    max={100000}
                    step={500}
                    sx={{ color: "rgb(51, 50, 50)" }}
                />
                <div className="priceRange"><span>{rupees(price[0])}</span><span>{rupees(price[1])}</span></div>

                <Typography className="filterTitle">Category</Typography>
                <ul className="categoryBox">
                    <li className={"category-link" + (!category ? " activeCategory" : "")} onClick={() => { setCategory(""); setcurrentPage(1) }}>All listings</li>
                    {categoryList.map(([value, label]) => (
                        <li
                            className={"category-link" + (category === value ? " activeCategory" : "")}
                            key={value}
                            onClick={() => { setCategory(value); setcurrentPage(1) }}
                        >
                            {label}
                        </li>
                    ))}
                </ul>

                <Typography className="filterTitle">Condition</Typography>
                <ul className="categoryBox">
                    <li className={"category-link" + (!condition ? " activeCategory" : "")} onClick={() => { setCondition(""); setcurrentPage(1) }}>Any</li>
                    {conditions.map((c) => (
                        <li className={"category-link" + (condition === c ? " activeCategory" : "")} key={c} onClick={() => { setCondition(c); setcurrentPage(1) }}>{c}</li>
                    ))}
                </ul>

                <fieldset>
                    <Typography component="legend" className="filterTitle">Seller rating above</Typography>
                    <Slider
                        value={ratings}
                        onChange={(e, newRating) => { setRatings(newRating); }}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                        step={0.5}
                        sx={{ color: "rgb(51, 50, 50)" }}
                    />
                </fieldset>
            </aside>

            <main className="shopMain">
                <div className="shopHead">
                    <h1>{title}</h1>
                    {!loading && <span>{count} {count === 1 ? "listing" : "listings"}</span>}
                </div>

                {loading ? <Loader /> : products && products.length > 0 ? (
                    <div className="container">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="noListings">
                        <h3>Nothing here yet</h3>
                        <p>Try a wider price range or another category, or <Link to="/sell">post the first listing</Link>.</p>
                    </div>
                )}

                {!loading && resultPerPage < count && (
                    <div className="paginationBox">
                        <Pagination
                            activePage={currentPage}
                            itemsCountPerPage={resultPerPage}
                            totalItemsCount={filteredProductsCount}
                            onChange={setCurrentPageNo}
                            nextPageText="Next"
                            prevPageText="Prev"
                            firstPageText="First"
                            lastPageText="Last"
                            itemClass="page-item"
                            linkClass="page-link"
                            activeClass="pageItemActive"
                            activeLinkClass="pageLinkActive"
                        />
                    </div>
                )}
            </main>
        </div>
    )
}
