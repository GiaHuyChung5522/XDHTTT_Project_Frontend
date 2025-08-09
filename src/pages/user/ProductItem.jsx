import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./ProductItem.css";

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    Number(n || 0)
  );

const ProductItem = ({ product }) => {
  if (!product) return null;

  const { id, name, description, price, image, badge } = product;
  const imgSrc = image || "/src/assets/img/sanpham1.jpg";

  return (
    <div className="product-item">
      <div style={{ position: "relative" }}>
        {badge && <div className="product-item__badge">{badge}</div>}
        <Link to={`/products/${id}`} aria-label={`Xem chi tiết ${name}`}>
          <img src={imgSrc} alt={name} className="product-item__image" loading="lazy" />
        </Link>
      </div>

      <div className="product-item__content">
        <h3 className="product-item__name">{name}</h3>
        <div className="product-item__price">{currency(price)}</div>
        <div className="product-item__footer">
          <span>1 phiên bản</span>
          <span>Yêu thích</span>
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    badge: PropTypes.string,
  }),
};

export default ProductItem;
