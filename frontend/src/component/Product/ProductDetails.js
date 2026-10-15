import React, { Fragment, useEffect, useState } from 'react'
import "./ProductDetails.css";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProductDetails, removeSelectedProduct } from '../../actions/productsAction';
import { Link, useParams } from 'react-router-dom';
import { rupees, timeAgo } from '../Home/ProductCard';
import ReviewCard from './ReviewCard';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
import ReactStars from "react-rating-stars-component";
import { addItemsToCart } from '../../actions/cartAction';

export default function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch()
    const alert = useAlert()
    const { product, loading, error } = useSelector((state) => state.productDetails)

    const [quantity, setQuantity] = useState(1)
    const increaseQuantity = () => {
        if (product.Stock <= quantity) {
            return
        }
        const qty = quantity + 1
        setQuantity(qty)
    }

    const decreaseQuantity = () => {
        if (quantity <= 1) {
            return
        }
        const qty = quantity - 1
        setQuantity(qty)
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(id, quantity))
        alert.success("Items added to Cart Successfully")
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [dispatch, error, alert])

    useEffect(() => {
        dispatch(getProductDetails(id))

        return () => {
            dispatch(removeSelectedProduct());
        };
    }, [dispatch, id])

    const seller = product.user && product.user.name ? product.user : null
    const save = product.originalPrice > product.price ? Math.round((1 - product.price / product.originalPrice) * 100) : 0

    const contactSeller = () => {
        alert.info("Messaging sellers is switched off in this public demo")
    }

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <div className='content'>
                        <div className="crumbs">
                            <Link to="/products">All listings</Link> / <Link to={`/products?category=${product.category}`}>{product.category}</Link>
                        </div>
                        <div className='box-outer'>
                            <div className='box-left'>
                                <Carousel autoPlay={false} navButtonsAlwaysInvisible={!product.images || product.images.length < 2}>
                                    {product.images &&
                                        product.images.map((item, i) => (
                                            <img
                                                className="CarouselImage"
                                                key={i}
                                                src={item.url}
                                                alt={`${product.name} ${i + 1}`}
                                            />
                                        ))}
                                </Carousel>
                            </div>

                            <div className="product">
                                <div className="product-details">
                                    <div className="product-name">{product.name}</div>
                                </div>
                                <div className="product-priceRow">
                                    <span className="product-price">{rupees(product.price)}</span>
                                    {save > 0 && <s>{rupees(product.originalPrice)}</s>}
                                    {save > 0 && <em>{save}% off the new price</em>}
                                </div>

                                <ul className="factList">
                                    {product.condition && <li><b>Condition</b><span>{product.condition}</span></li>}
                                    {product.location && <li><b>Meet at</b><span>{product.location}</span></li>}
                                    {product.createdAt && <li><b>Posted</b><span>{timeAgo(product.createdAt)}</span></li>}
                                    <li><b>Category</b><span>{product.category}</span></li>
                                </ul>

                                <div className="product-description">
                                    {product.description}
                                </div>

                                {seller && (
                                    <div className="sellerCard">
                                        <i>{seller.name[0]}</i>
                                        <div>
                                            <b>{seller.name}</b>
                                            <span>{[seller.hostel, seller.year].filter(Boolean).join(" · ") || "Student seller"}</span>
                                            <div className="detailsBlock-stars">
                                                <ReactStars count={5} value={product.rating} size={16} edit={false} isHalf={true} activeColor="#ffa41c" />
                                                <span className="detailsBlock-stars-span">seller rating</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="detailsBlock-Cart">
                                    <div className="detailsBlock-Cart-1">
                                        <div className="detailsBlock-Cart-Number">
                                            <button onClick={decreaseQuantity}>-</button>
                                            <input type="number" value={quantity} readOnly />
                                            <button onClick={increaseQuantity}>+</button>
                                        </div>
                                        <p>{product.Stock} available</p>
                                    </div>
                                    <p>
                                        Status:{" "}
                                        <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                            {product.Stock < 1 ? "Sold" : "Available"}
                                        </b>
                                    </p>
                                </div>

                                <div className="buttonStyling">
                                    <div className="buttons" onClick={addToCartHandler}>Add To Cart</div>
                                    <div className="buttons redBackgroundColor" onClick={contactSeller}>Contact Seller</div>
                                </div>
                            </div>
                        </div>

                        <h2 className="reviewsHeading">What buyers say about this seller</h2>
                        {product.reviews && product.reviews[0] ? (
                            <div className="reviews">
                                {product.reviews.map((review) => (
                                    <ReviewCard key={review._id} review={review} />
                                ))}
                            </div>
                        ) : (
                            <p className="noReviews">No reviews yet</p>
                        )}
                    </div>
                </Fragment>}
        </Fragment>
    )
}
