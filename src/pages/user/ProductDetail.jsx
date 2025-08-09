import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../services/products";
import { useCartStore } from "../../stores/cart";

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n || 0));

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErr("");
    (async () => {
      try {
        const data = await getProductById(id);
        if (!alive) return;
        setProduct(data);
      } catch (e) {
        if (!alive) return;
        console.error(e);
        setErr("Không tải được sản phẩm.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow">Đang tải sản phẩm…</div>;
  }
  if (err || !product) {
    return <div className="p-6 bg-white rounded-lg shadow">{err || "Không tìm thấy sản phẩm."}</div>;
  }

  const { name, description, price, image } = product;
  const imgSrc = image || "/src/assets/img/sanpham1.jpg";

  return (
    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img src={imgSrc} alt={name} className="w-full rounded-lg object-contain" loading="lazy" />
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2">{name}</h1>
        <div className="text-xl text-red-500 font-semibold mb-4">{currency(price)}</div>

        {description ? <p className="text-gray-600 mb-6 whitespace-pre-line">{description}</p> : null}

        <div className="flex items-center gap-3 mb-6">
          <label htmlFor="qty" className="text-sm text-gray-600">
            Số lượng
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            className="w-24 border rounded-md px-3 py-2"
          />
        </div>

        <button
          onClick={() => addToCart(product, qty)}
          className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
