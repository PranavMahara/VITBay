import React from "react";
import { Link } from "react-router-dom";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";

export const timeAgo = (date) => {
    if (!date) return "";
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;
    return `${Math.floor(days / 30)} mo ago`;
};

export const rupees = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const ProductCard = ({ product }) => {
    const seller = product.user && product.user.name ? product.user : null;
    const save = product.originalPrice > product.price
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            <div className="productCardImg">
                <img src={product.images[0].url} alt={product.name} loading="lazy" />
                {product.condition && <span className="conditionTag">{product.condition}</span>}
            </div>
            <p className="productCardName">{product.name}</p>
            <div className="productCardPrice">
                <b>{rupees(product.price)}</b>
                {save > 0 && <s>{rupees(product.originalPrice)}</s>}
                {save > 0 && <em>{save}% off</em>}
            </div>
            <div className="productCardMeta">
                <PlaceOutlinedIcon fontSize="inherit" />
                <span>{product.location ? product.location : product.category}{product.createdAt ? ` · ${timeAgo(product.createdAt)}` : ""}</span>
            </div>
            {seller && <div className="productCardSeller"><i>{seller.name[0]}</i>{seller.name}</div>}
        </Link>
    );
};

export default ProductCard;
