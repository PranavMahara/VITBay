import React, { useEffect, useState } from 'react'
import "./Products.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productsAction'
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useParams, useSearchParams } from 'react-router-dom'
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
        dispatch(getProduct(keyword, currentPage, price, category, ratings));
    }, [dispatch, keyword, currentPage, price, category, ratings]);

    return (
        <div className="vb-page vb-shop">
            <aside className="vb-filters">
                <h3>Filters</h3>

                <div className="vb-filter-group">
                    <Typography className="vb-filter-title">Price</Typography>
                    <Slider
                        value={price}
                        onChange={priceHandler}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        min={0}
                        max={100000}
                        step={500}
                    />
                    <div className="vb-price-range"><span>₹{price[0].toLocaleString("en-IN")}</span><span>₹{price[1].toLocaleString("en-IN")}</span></div>
                </div>

                <div className="vb-filter-group">
                    <Typography className="vb-filter-title">Category</Typography>
                    <ul className="vb-categories">
                        <li className={!category ? "active" : ""} onClick={() => { setCategory(""); setcurrentPage(1) }}>All</li>
                        {categories.map((c) => (
                            <li
                                key={c}
                                className={category === c ? "active" : ""}
                                onClick={() => { setCategory(c); setcurrentPage(1) }}
                            >
                                {c === "SmartPhones" ? "Smartphones" : c}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="vb-filter-group">
                    <Typography className="vb-filter-title">Minimum rating</Typography>
                    <Slider
                        value={ratings}
                        onChange={(e, newRating) => { setRatings(newRating); }}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        min={0}
                        max={5}
                        step={0.5}
                    />
                </div>
            </aside>

            <main className="vb-shop-main">
                <div className="vb-shop-head">
                    <h1>{keyword ? `Results for “${keyword}”` : category ? (category === "SmartPhones" ? "Smartphones" : category) : "All products"}</h1>
                    {!loading && <span>{count} {count === 1 ? "item" : "items"}</span>}
                </div>

                {loading ? <Loader /> : products && products.length > 0 ? (
                    <div className="vb-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="vb-empty">
                        <h3>No products match your filters</h3>
                        <p>Try widening the price range or choosing another category.</p>
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
