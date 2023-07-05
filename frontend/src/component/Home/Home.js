import React, { Fragment, useEffect } from 'react'
import ProductCard from './ProductCard';
import "./Home.css";
import { clearErrors, getProduct } from '../../actions/productsAction';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';

export default function Home() {
    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, error, products } = useSelector((state) => state.products)

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProduct())
    }, [dispatch, error, alert])
    return (
        <Fragment>
            {loading ? (<Loader />) : (
                <Fragment>
                    <div> 
                        <div className='banner'>
                            <h2>Trending Products</h2>
                        </div>

                        <div className="container" id="container">
                            {products &&
                                products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                        </div>

                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}
