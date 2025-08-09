import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import "./ProductList.css";
import { getProducts } from "../../services/products";
import FilterTabsHeader from "../../components/FilterTabsHeader";

const ProductList = ({
  title = "Máy tính xách tay",
  tabs = [],
  totalOverride,
  fixedQ = "",              // filter cố định (vd: "Apple")
  itemRenderer,            // (product)=>JSX — dùng card tuỳ biến
}) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [fade, setFade] = useState(false);

  const q = [fixedQ, active].filter(Boolean).join(" ").trim();

  useEffect(() => {
    let alive = true;
    setLoading(true); setErr("");
    (async () => {
      try {
        const { items: data, total: t } = await getProducts({
          page, limit, q, sort: "id", order: "desc",
        });
        if (!alive) return;
        setItems(data); setTotal(t);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setErr("Không tải được danh sách sản phẩm.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [page, limit, q]);

  const totalShow = totalOverride ?? total;
  const totalPages = Math.max(1, Math.ceil(totalShow / limit));

  const changePage = (p) => {
    if (p === page) return;
    setFade(true);
    setTimeout(() => { setPage(p); setFade(false); }, 200);
  };

  return (
    <section className="product-showcase">
      <FilterTabsHeader
        title={title}
        options={tabs}
        value={active}
        onChange={(opt) => { setActive(opt); setPage(1); }}
        total={totalShow}
      />

      {loading ? (
        <div className="bg-white rounded-lg shadow p-4">Đang tải…</div>
      ) : err ? (
        <div className="bg-red-50 text-red-600 rounded-lg shadow p-4">{err}</div>
      ) : (
        <>
          <div className={`product-showcase__grid ${fade ? "fade-out" : "fade-in"}`}>
            {items.map((p) => (
              <div key={p.id} className="product-card">
                {itemRenderer ? itemRenderer(p) : <ProductItem product={p} />}
              </div>
            ))}
          </div>

         
        </>
      )}
    </section>
  );
};

export default ProductList;
