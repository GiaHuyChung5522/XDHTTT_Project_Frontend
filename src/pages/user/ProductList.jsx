import { useEffect, useMemo, useState } from "react";
import "./ProductList.css";
import { getProducts } from "../../services/products";
import FilterTabsHeader from "../../components/FilterTabsHeader";
import { useCart } from "../../context/CartContext";
import { message } from 'antd';
import ProductCard from "../../components/ProductCard";
import { getSafeString } from "../../utils/initData";

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

const ProductList = ({
  title = "Laptop văn phòng",
  tabs = [],
  fixedQ = "",
  category = "",             // Filter theo category
  itemRenderer = null,       // (product)=>JSX — nếu muốn override card
  viewAllHref = "/products",
  totalOverride = null,      // optional: nếu muốn hiển thị tổng tùy chính
}) => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [fade, setFade] = useState(false);
  const { addToCart } = useCart();

  // Luôn hiển thị đúng 5 sản phẩm như mẫu
  const limit = 5;
  const q = useMemo(
    () => [fixedQ, active].filter(Boolean).join(" ").trim(),
    [fixedQ, active]
  );

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    setFade(true);

    (async () => {
      try {
        const { items: data, total } = await getProducts({
          page: 1,
          limit,
          q,
          category,
          sort: "id",
          order: "desc",
        });
        if (!alive) return;
        setItems(data || []);
        // Lưu tổng nếu cần hiển thị (dùng totalOverride nếu có)
        if (typeof totalOverride === "undefined") {
          // không cần set state riêng; hiển thị trực tiếp từ API trong header
        }
      } catch (e) {
        if (!alive) return;
        console.error('Lỗi tải sản phẩm:', e);
        setErr(e.message || "Không thể tải danh sách sản phẩm. Vui lòng kiểm tra kết nối mạng hoặc đăng nhập lại.");
        message.error(e.message || "Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        if (alive) {
          setLoading(false);
          setTimeout(() => setFade(false), 150);
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [q]); // đổi tabs/fixedQ sẽ refetch

  const totalShow = totalOverride; // nếu cần bạn có thể truyền từ ngoài

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleLike = (product) => {
    // TODO: Implement like functionality
    console.log('Like product:', product.name);
  };

  const handleCompare = (product) => {
    // TODO: Implement compare functionality
    console.log('Compare product:', product.name);
  };

  // Tạo thông số chi tiết cho sản phẩm
  const getProductSpecifications = (product) => {
    // Tạo thông số mẫu dựa trên tên sản phẩm
    const specs = {
      cpu: "Intel Core Ultra 5 225H",
      ram: "32GB LPDDR5x 8533MHz, onboard",
      screen: "14.5\" 3K (3072x1920), ~500nits",
      graphics: "Intel® Arc™ 130T GPU (onboard)"
    };

    // Tùy chỉnh theo tên sản phẩm
    const productName = getSafeString(product.name).toLowerCase();
    if (productName.includes('lenovo')) {
      specs.cpu = "Intel Core Ultra 5 225H";
      specs.ram = "32GB LPDDR5x 8533MHz, onboard";
      specs.screen = "14.5\" 3K (3072x1920), ~500nits";
      specs.graphics = "Intel® Arc™ 130T GPU (onboard)";
    } else if (productName.includes('gigabyte')) {
      specs.cpu = "Intel Core i7-12700H";
      specs.ram = "16GB DDR4 3200MHz";
      specs.screen = "15.6\" FHD (1920x1080) IPS";
      specs.graphics = "NVIDIA GeForce RTX 4060";
    } else if (productName.includes('acer')) {
      specs.cpu = "AMD Ryzen 7 8745H";
      specs.ram = "16GB DDR5 4800MHz";
      specs.screen = "15.6\" FHD (1920x1080) IPS";
      specs.graphics = "AMD Radeon™ 780M";
    } else if (productName.includes('dell')) {
      specs.cpu = "Intel Core i5-1235U";
      specs.ram = "8GB DDR4 3200MHz";
      specs.screen = "15.6\" FHD (1920x1080) IPS";
      specs.graphics = "Intel Iris Xe Graphics";
    }

    // Luôn trả về specs (không bao giờ trống)
    return specs;
  };

  return (
    <section className="product-showcase">
      {/* Header với FilterTabsHeader + Xem tất cả */}
      <div className="product-showcase__header">
        <div className="product-showcase__title-section">
          <h2 className="product-showcase__title">{title}</h2>
        </div>

        <div className="product-showcase__filters">
          <FilterTabsHeader
            title=""
            options={tabs}
            value={active}
            onChange={(opt) => {
              setActive(opt);
            }}
            total={totalShow}
          />
          <a href={viewAllHref} className="product-showcase__view-all">
            {`Xem tất cả${typeof totalShow === "number" ? ` (${totalShow})` : ""}`}
          </a>
        </div>
      </div>

      {/* Danh sách 5 sản phẩm theo hàng ngang */}
      {loading ? (
        <div className="product-showcase__products" aria-busy="true">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={`sk-${i}`} className="product-card skeleton-card">
              <div className="product-card__image-container">
                <div className="skeleton skeleton-img" />
              </div>
              <div className="product-card__content">
                <div className="skeleton-line lg skeleton" />
                <div className="skeleton-line skeleton" />
                <div className="skeleton-line sm skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : err ? (
        <div className="product-list__error" role="alert">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Không thể tải sản phẩm</h3>
            <p>{err}</p>
            <div className="error-actions">
              <button 
                className="btn-retry" 
                onClick={() => window.location.reload()}
              >
                🔄 Thử lại
              </button>
              <button 
                className="btn-login" 
                onClick={() => window.location.href = '/login'}
              >
                🔑 Đăng nhập
              </button>
            </div>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="product-list__empty">Không có sản phẩm.</div>
      ) : (
        <div className={`product-showcase__products ${fade ? "fade-out" : "fade-in"}`}>
          {items.map((p) => {
            console.log("🔍 ProductList - Sản phẩm:", p);
            if (itemRenderer) {
              return (
                <div key={p._id || p.id} className="product-card">
                  {itemRenderer(p)}
                </div>
              );
            }

            return (
              <ProductCard
                key={p._id || p.id}
                id={p._id || p.id}
                badge={p.badge || "Sẵn Hàng Tại Showroom"}
                image={p.imageUrl || p.image || FALLBACK_IMG}
                name={p.name}
                price={p.price || 0}
                version="1 phiên bản"
                specifications={getProductSpecifications(p)}
                onCompare={() => handleCompare(p)}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductList;
