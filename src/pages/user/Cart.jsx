import { useMemo } from "react";
import { useCartStore } from "../../stores/cart";
import "./cart.css";

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n || 0));

function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCartStore();

  const subTotal = useMemo(() => total(), [items, total]);

  if (!items?.length) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">Giỏ hàng của bạn</h1>
        <p>Chưa có sản phẩm nào. Hãy tiếp tục mua sắm nhé!</p>
      </div>
    );
  }

  return (
    <div className="cart bg-white rounded-lg shadow p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 border text-left">Sản phẩm</th>
              <th className="p-3 border text-right">Giá</th>
              <th className="p-3 border text-center">Số lượng</th>
              <th className="p-3 border text-right">Tổng</th>
              <th className="p-3 border"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td className="p-3 border">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.image || "/src/assets/img/sanpham1.jpg"}
                      alt={it.name}
                      className="w-16 h-16 object-contain rounded"
                      loading="lazy"
                    />
                    <div className="font-medium">{it.name}</div>
                  </div>
                </td>
                <td className="p-3 border text-right">{currency(it.price)}</td>
                <td className="p-3 border text-center">
                  <input
                    type="number"
                    min={1}
                    value={it.qty || 1}
                    onChange={(e) => updateQty(it.id, e.target.value)}
                    className="w-20 border rounded px-2 py-1 text-center"
                  />
                </td>
                <td className="p-3 border text-right">
                  {currency(Number(it.price || 0) * Number(it.qty || 1))}
                </td>
                <td className="p-3 border text-center">
                  <button
                    onClick={() => removeItem(it.id)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <button
          onClick={clearCart}
          className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 transition"
        >
          Xóa toàn bộ
        </button>

        <div className="text-right">
          <div className="text-sm text-gray-600">Tạm tính</div>
          <div className="text-2xl font-bold">{currency(subTotal)}</div>
          <button className="mt-3 rounded-md bg-green-600 px-5 py-2 text-white hover:bg-green-700 transition">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
