import React, { Fragment, useEffect, useState } from 'react'
import "./ProductDetails.css";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, getProductDetails, removeSelectedProduct } from '../../actions/productsAction';
import { useParams } from 'react-router-dom';
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
        dispatch(getProductDetails(id))

        return () => {
            dispatch(removeSelectedProduct());
        };
    }, [dispatch, id, error, alert])

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <div className='content'>
                        <div className='box-outer'>
                            <div className='box-left'>
                                <Carousel>
                                    {product.images &&
                                        product.images.map((item, i) => (
                                            <img
                                                className="CarouselImage"
                                                key={i}
                                                src={item.url}
                                                alt={`${i} Slide`}
                                            />
                                        ))}
                                </Carousel>
                            </div>

                            <div className="product">
                                <div className="product-details">
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-price">₹{product.price}</div>
                                </div>

                                <div className="detailsBlock-stars">
                                    <ReactStars
                                        count={5}
                                        value={product.rating}
                                        size={24}
                                        activeColor="#ffd700"
                                    />
                                    <span className="detailsBlock-stars-span">
                                        {" "}
                                        ({product.numOfReviews} Reviews)
                                    </span>
                                </div>

                                <div className="product-id">Product ID : {product._id}</div>

                                <div className="product-description">
                                    {product.description}
                                </div>

                                <div className="detailsBlock-Cart">
                                    <div className="detailsBlock-Cart-1">
                                        <div className="detailsBlock-Cart-Number">
                                            <button onClick={decreaseQuantity}>-</button>
                                            <input type="number" value={quantity} />
                                            <button onClick={increaseQuantity}>+</button>
                                        </div>

                                        <p>Number of items available : {product.Stock}</p>
                                    </div>

                                    <p>
                                        Status:{" "}
                                        <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                            {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                        </b>
                                    </p>
                                </div>

                                <div className="buttonStyling">
                                    <div className="buttons" onClick={addToCartHandler}>Add To Cart</div>
                                    <div className="buttons redBackgroundColor">Submit Review</div>
                                </div>

                            </div>

                        </div>

                        {product.reviews && product.reviews[0] ? (
                            <div className="reviews">
                                {product.reviews &&
                                    product.reviews.map((review) => (
                                        <ReviewCard key={review._id} review={review} />
                                    ))}
                            </div>
                        ) : (
                            <p className="noReviews">No Reviews Yet</p>
                        )}
                    </div>
                </Fragment>}
        </Fragment>
    )
}
