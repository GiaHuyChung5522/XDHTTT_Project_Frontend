import { useEffect, useMemo, useState } from "react";
import "./ProductList.css";
import { getProducts } from "../../services/products";
import FilterTabsHeader from "../../components/FilterTabsHeader";

const FALLBACK_IMG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

const ProductList = ({
  title = "Máy tính xách tay",
  tabs = [],
  fixedQ = "",
  itemRenderer,       // (product)=>JSX — nếu muốn override card
  viewAllHref = "/products",
  totalOverride,      // optional: nếu muốn hiển thị tổng tùy chính
  limit = 5,          // Mặc định hiển thị 5 sản phẩm
  rows = 1,           // Số hàng muốn hiển thị (1 hoặc 2)
}) => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [fade, setFade] = useState(false);

  // Tính toán số sản phẩm cần hiển thị dựa trên số hàng
  const productsPerRow = 5; // 5 sản phẩm mỗi hàng
  const displayLimit = rows * productsPerRow; // Tổng số sản phẩm cần hiển thị

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
          limit: displayLimit, // Sử dụng displayLimit thay vì limit
          q,
          sort: "id",
          order: "desc",
        });
        if (!alive) return;
        setItems(data || []);
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
  }, [q, displayLimit]); // Thêm displayLimit vào dependencies

  const totalShow = totalOverride;

  return (
    <section className="product-showcase">
      {/* Header với tiêu đề và bộ lọc */}
      <div className="product-showcase__header">
        <div className="product-showcase__title-section">
          <h2 className="product-showcase__title">{title}</h2>
          {/* Hiển thị số lượng sản phẩm */}
          {items.length > 0 && (
            <span className="product-showcase__count">({items.length} sản phẩm)</span>
          )}
        </div>

        <div className="product-showcase__filters">
          {/* Bộ lọc thương hiệu */}
          <div className="product-showcase__brand-filters">
            <span className="brand-filter">Acer</span>
            <span className="brand-filter">Lenovo</span>
            <span className="brand-filter">Apple</span>
            <span className="brand-filter">Gigabyte</span>
          </div>
          
          {/* FilterTabsHeader nếu có tabs */}
          {tabs.length > 0 && (
            <FilterTabsHeader
              title=""
              options={tabs}
              value={active}
              onChange={(opt) => {
                setActive(opt);
              }}
              total={totalShow}
            />
          )}
          
          <a href={viewAllHref} className="product-showcase__view-all">
            {`Xem tất cả${typeof totalShow === "number" ? ` (${totalShow})` : ""}`}
          </a>
        </div>
      </div>

      {/* Danh sách sản phẩm theo số hàng được chỉ định */}
      {loading ? (
        <div className="product-showcase__products" aria-busy="true">
          {Array.from({ length: displayLimit }).map((_, i) => (
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
        <div className={`product-showcase__products product-showcase__products--${rows}-rows ${fade ? "fade-out" : "fade-in"}`}>
          {items.map((p) => {
            if (itemRenderer) {
              return (
                <div key={p.id} className="product-card">
                  {itemRenderer(p)}
                </div>
              );
            }

            const cpu = p.cpu ?? p.specs?.cpu ?? p.description;
            const ram = p.ram ?? p.specs?.ram;
            const screen = p.screen ?? p.specs?.screen;
            const gpu = p.gpu ?? p.specs?.graphics;

            return (
              <div key={p.id} className="product-card" title={p.name}>
                {/* Badge màu cam như trong ảnh */}
                <div className="product-card__badge">
                  {p.badge ?? "Sẵn Hàng Tại Showroom"}
                </div>

                {/* Hình ảnh sản phẩm */}
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

                {/* Thông tin cơ bản - giống hệt ảnh */}
                <div className="product-card__content">
                  <h3 className="product-card__name">{p.name}</h3>
                  {p.price && <div className="product-card__price">{p.price}</div>}
                  <div className="product-card__versions">
                    {p.versionsLabel ?? p.versions ?? "1 phiên bản"}
                  </div>
                  <div className="product-card__favorite">
                    <span className="heart-icon">♥</span> Yêu thích
                  </div>
                </div>

                {/* Overlay chi tiết khi hover - giống hệt ảnh */}
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
                    {/* Nút thêm vào giỏ hàng */}
                    <button
                      className="btn btn--cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: thêm vào giỏ
                      }}
                      title="Thêm vào giỏ hàng"
                    >
                      <span className="cart-icon">🛒</span>
                      Thêm vào giỏ
                    </button>
                    
                    {/* Nút so sánh */}
                    <button
                      className="btn btn--compare"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: logic so sánh
                      }}
                      title="So sánh sản phẩm"
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