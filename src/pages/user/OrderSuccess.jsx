// src/pages/OrderSuccess.jsx
import { useEffect, useMemo } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useCartStore } from "../../stores/cart";
import "./order-success.css";

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n || 0));

export default function OrderSuccess() {
  const { clearCart } = useCartStore();
  const { state } = useLocation();
  const [sp] = useSearchParams();

  // Lấy dữ liệu đơn hàng: ưu tiên location.state, sau đó querystring, cuối cùng fallback
  const order = useMemo(() => {
    const s = state?.order || {};
    const q = {
      code: sp.get("code"),
      name: sp.get("name"),
      phone: sp.get("phone"),
      address: sp.get("address"),
      note: sp.get("note"),
      subtotal: Number(sp.get("subtotal")),
      shippingText: sp.get("shippingText") || "Liên hệ",
      total: Number(sp.get("total")),
    };
    const o = { ...q, ...s };
    return {
      code: o.code || "DH00005127",
      name: o.name || "Anh phuoc0519",
      phone: o.phone || "0935771670",
      address:
        o.address ||
        "1 Hai Bà Trưng, Thạnh Xuân, Quận 12, TP.HCM (nhân viên sẽ gọi xác nhận trước khi giao)",
      note: o.note || "",
      subtotal: o.subtotal ?? 39461250,
      shippingText: o.shippingText ?? "Liên hệ",
      total: o.total ?? 39461250,
    };
  }, [state, sp]);

  useEffect(() => {
    clearCart(); // dọn giỏ sau khi đặt hàng
  }, [clearCart]);

  return (
    <div className="container">
      <div className="order-success">
        <div className="order-success__head">
          <span className="order-success__icon" aria-hidden />
          <h1 className="order-success__title">ĐẶT HÀNG THÀNH CÔNG</h1>
        </div>

        <p className="order-success__thanks">
          Cảm ơn <strong>{order.name}</strong> đã cho chúng tôi cơ hội được phục vụ.
        </p>

        <div className="order-card">
          <div className="order-card__row"><span>Đơn hàng:</span><strong>{order.code}</strong></div>
          <div className="order-card__row"><span>Người nhận hàng:</span><strong>{order.name}</strong></div>
          <div className="order-card__row"><span>Số điện thoại:</span><strong>{order.phone}</strong></div>
          <div className="order-card__row order-card__row--col">
            <span>Địa chỉ:</span>
            <div className="order-card__text">{order.address}</div>
          </div>
          {order.note ? (
            <div className="order-card__row order-card__row--col">
              <span>Ghi chú đơn hàng:</span>
              <div className="order-card__text">{order.note}</div>
            </div>
          ) : null}

          <div className="order-card__sep" />

          <div className="order-card__row"><span>Tạm tính:</span><strong>{currency(order.subtotal)}</strong></div>
          <div className="order-card__row"><span>Phí vận chuyển:</span><strong>{order.shippingText}</strong></div>
          <div className="order-card__row order-card__row--total">
            <span>Tổng tiền:</span><strong className="order-card__total">{currency(order.total)}</strong>
          </div>
        </div>

        <div className="order-success__link">
          <Link to="/orders" className="order-success__a">Đi đến trang QUẢN LÝ ĐƠN HÀNG →</Link>
        </div>

        <ul className="order-progress">
          <li className="order-progress__item order-progress__item--done">
            <span className="order-progress__dot" />
            <span className="order-progress__label">Đặt hàng thành công</span>
          </li>
          <li className="order-progress__item">
            <span className="order-progress__dot" />
            <span className="order-progress__label">Trao đổi chốt đơn</span>
          </li>
          <li className="order-progress__item">
            <span className="order-progress__dot" />
            <span className="order-progress__label">Chờ giao hàng</span>
          </li>
          <li className="order-progress__item">
            <span className="order-progress__dot" />
            <span className="order-progress__label">Nhận hàng</span>
          </li>
        </ul>

        <div className="order-success__note">
          Để hoàn tất thủ tục cho đơn hàng của bạn, hãy chat ngay với Chúng Tôi
        </div>

        <div className="order-success__actions">
          <a href="#" className="btn btn--outline">Chat ngay</a>
          <a href="#" className="btn btn--primary">Về trang chủ</a>
        </div>

        <p className="order-success__more">
          Xem thêm thông tin liên quan tới <a href="#" className="order-success__a">Quy trình mua hàng online</a>.
        </p>
      </div>
    </div>
  );
}
