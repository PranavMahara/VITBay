import React from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";

const ProductCard = ({ product }) => {
    return (
        <Link className="vb-card" to={`/product/${product._id}`}>
            <div className="vb-card-img">
                <img src={product.images[0].url} alt={product.name} loading="lazy" />
                {product.category && <span className="vb-card-tag">{product.category}</span>}
                {product.Stock < 1 && <span className="vb-card-sold">Sold out</span>}
            </div>
            <div className="vb-card-body">
                <p className="vb-card-name">{product.name}</p>
                <div className="vb-card-meta">
                    <Rating value={product.rating} readOnly precision={0.5} size="small" />
                    <span>({product.numOfReviews})</span>
                </div>
                <div className="vb-card-price">₹{Number(product.price).toLocaleString("en-IN")}</div>
            </div>
        </Link>
    );
};

export default ProductCard;
