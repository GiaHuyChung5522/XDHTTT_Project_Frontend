import { useEffect, useMemo, useState } from "react";
import "./ProductList.css";
import { getProducts } from "../../services/products";
import FilterTabsHeader from "../../components/FilterTabsHeader";
import { useCart } from "../../context/CartContext";
import { message } from 'antd';

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

const ProductList = ({
  title = "Máy tính xách tay",
  tabs = [],
  fixedQ = "",
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
        console.error(e);
        setErr("Không tải được danh sách sản phẩm.");
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
    message.success(`Đã thêm ${product.name} vào giỏ hàng!`);
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
        <div className="product-list__error" role="alert">{err}</div>
      ) : items.length === 0 ? (
        <div className="product-list__empty">Không có sản phẩm.</div>
      ) : (
        <div className={`product-showcase__products ${fade ? "fade-out" : "fade-in"}`}>
          {items.map((p) => {
            if (itemRenderer) {
              // Cho phép custom card bên ngoài
              return (
                <div key={p.id} className="product-card">
                  {itemRenderer(p)}
                </div>
              );
            }

            const cpu = p.cpu ?? p.specs?.cpu;
            const ram = p.ram ?? p.specs?.ram;
            const screen = p.screen ?? p.specs?.screen;
            const gpu = p.gpu ?? p.specs?.graphics;

            return (
              <div key={p.id} className="product-card" title={p.name}>
                {/* Badge */}
                {(p.badge || p.isNew) && (
                  <div className="product-card__badge">
                    {p.badge ?? "Sản phẩm mới"}
                  </div>
                )}

                {/* Ảnh */}
                <div className="product-card__image-container">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="product-card__image"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                  />
                </div>

                {/* Thông tin cơ bản */}
                <div className="product-card__content">
                  <h3 className="product-card__name">{p.name}</h3>
                  {p.price && <div className="product-card__price">{p.price}</div>}
                  {(p.versionsLabel || p.versions) && (
                    <div className="product-card__versions">
                      {p.versionsLabel ?? (Array.isArray(p.versions) ? p.versions.join(", ") : p.versions)}
                    </div>
                  )}
                  <div className="product-card__favorite">
                    <span className="heart-icon">♥</span> Yêu thích
                  </div>
                </div>

                {/* Overlay chi tiết khi hover (giống mẫu) */}
                <div className="product-card__details">
                  <div className="product-card__specs">
                    {cpu && (
                      <div className="spec-item">
                        <strong>CPU:</strong> {cpu}
                      </div>
                    )}
                    {ram && (
                      <div className="spec-item">
                        <strong>RAM:</strong> {ram}
                      </div>
                    )}
                    {screen && (
                      <div className="spec-item">
                        <strong>Màn hình:</strong> {screen}
                      </div>
                    )}
                    {gpu && (
                      <div className="spec-item">
                        <strong>Đồ họa:</strong> {gpu}
                      </div>
                    )}
                  </div>

                  <div className="product-card__actions">
                    <button
                      className="btn btn--cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                    >
                      <span className="cart-icon">🛒</span>
                      Thêm vào giỏ
                    </button>
                    <button
                      className="btn btn--compare"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: logic so sánh
                      }}
                    >
                      So sánh
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductList;
