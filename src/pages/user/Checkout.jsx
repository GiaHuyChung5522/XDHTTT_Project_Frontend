import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../stores/cart";
import "./checkout.css";

const currency = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(n || 0));

export default function Checkout() {
  const { items, total, updateQty, removeItem } = useCartStore();
  const subTotal = useMemo(() => total(), [items, total]);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    gender: "male",
    name: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    address: "",
    note: "",
    addrtype: "home",
  });
  const setF = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Vui lòng nhập họ tên.";
    if (!/^0\d{9,10}$/.test(form.phone)) return "Số điện thoại không hợp lệ.";
    if (!form.city || !form.district || !form.ward || !form.address.trim()) return "Địa chỉ chưa đầy đủ.";
    if (!items.length) return "Giỏ hàng đang trống.";
    return "";
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const fullAddress = `${form.address}, ${form.ward}, ${form.district}, ${form.city}`;
    const order = {
      code: "DH" + Date.now().toString().slice(-7),
      name: (form.gender === "male" ? "Anh " : "Chị ") + form.name.trim(),
      phone: form.phone,
      address: fullAddress,
      note: form.note,
      subtotal: subTotal,
      shippingText: "Liên hệ",
      total: subTotal,
    };
    navigate("/success", { state: { order } });
  };

  const changeQty = (id, cur, delta) => {
    const n = Math.max(1, Number(cur || 1) + Number(delta || 0));
    updateQty(id, n);
  };

  return (
    <form className="container" onSubmit={handlePlaceOrder}>
      <div className="row">
        <div className="col-8">
          <section className="customer card">
            <div className="customer__head">
              <h2 className="customer__title">THÔNG TIN KHÁCH HÀNG</h2>
            </div>

            <div className="customer__buytype">
              <button type="button" className="customer__buybtn customer__buybtn--active">Giao tận nơi</button>
              <button type="button" className="customer__buybtn">Nhận tại cửa hàng</button>
            </div>

            <div className="customer__row">
              <label className="customer__radio">
                <input type="radio" name="gender" value="male"
                       checked={form.gender === "male"} onChange={setF("gender")} /> <span>Anh</span>
              </label>
              <label className="customer__radio">
                <input type="radio" name="gender" value="female"
                       checked={form.gender === "female"} onChange={setF("gender")} /> <span>Chị</span>
              </label>
            </div>

            <div className="customer__grid">
              <div className="customer__field">
                <label>Họ và tên *</label>
                <input className="customer__input" placeholder="Nhập họ tên"
                       value={form.name} onChange={setF("name")} />
              </div>
              <div className="customer__field">
                <label>Số điện thoại *</label>
                <input className="customer__input" placeholder="Số điện thoại" inputMode="tel"
                       value={form.phone} onChange={setF("phone")} />
              </div>

              <div className="customer__field">
                <label>Tỉnh/ Thành phố *</label>
                <input className="customer__input" placeholder="Tỉnh/ Thành phố"
                       value={form.city} onChange={setF("city")} />
              </div>
              <div className="customer__field">
                <label>Quận/ Huyện *</label>
                <input className="customer__input" placeholder="Quận/ Huyện"
                       value={form.district} onChange={setF("district")} />
              </div>

              <div className="customer__field">
                <label>Phường/ Xã *</label>
                <input className="customer__input" placeholder="Phường/ Xã"
                       value={form.ward} onChange={setF("ward")} />
              </div>
              <div className="customer__field">
                <label>Số nhà, tên đường *</label>
                <input className="customer__input" placeholder="Số nhà, tên đường"
                       value={form.address} onChange={setF("address")} />
              </div>
            </div>

            <div className="customer__row">
              <label className="customer__radio">
                <input type="radio" name="addrtype" value="home"
                       checked={form.addrtype === "home"} onChange={setF("addrtype")} />
                <span>NHÀ RIÊNG (giao mọi thời gian)</span>
              </label>
              <label className="customer__radio">
                <input type="radio" name="addrtype" value="office"
                       checked={form.addrtype === "office"} onChange={setF("addrtype")} />
                <span>CƠ QUAN (giờ hành chính)</span>
              </label>
            </div>

            <div className="customer__field customer__field--full">
              <label>Yêu cầu khác (không bắt buộc)</label>
              <textarea className="customer__input customer__input--textarea" rows={3}
                        value={form.note} onChange={setF("note")} />
            </div>

            <div className="customer__row customer__row--checks">
              <label className="customer__check"><input type="checkbox" /> Gọi người khác nhận hàng (nếu có)</label>
              <label className="customer__check"><input type="checkbox" /> Xuất hóa đơn công ty</label>
            </div>
          </section>
        </div>

        <div className="col-4">
          <aside className="summary card p-3 position-sticky" style={{ top: 16 }}>
            <h3 className="summary__title mb-2">SẢN PHẨM ĐÃ CHỌN</h3>

            {!items.length && <div className="text-muted">Chưa có sản phẩm.</div>}

            <ul className="summary__list mb-3">
              {items.map((it) => (
                <li key={it.id} className="summary__item border rounded p-2 position-relative bg-white">
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-2"
                    aria-label="Xóa"
                    onClick={() => removeItem(it.id)}
                  />
                  <img
                    src={it.image || "/src/assets/img/sanpham1.jpg"}
                    alt={it.name}
                    className="summary__img rounded border"
                  />
                  <div className="summary__info flex-grow-1">
                    <div className="summary__name fw-semibold">{it.name}</div>

                    <div className="d-flex align-items-center justify-content-between">
                      <div className="btn-group btn-group-sm" role="group" aria-label="Số lượng">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => changeQty(it.id, it.qty, -1)}
                          disabled={(it.qty || 1) <= 1}
                        >−</button>

                        <input
                          className="form-control form-control-sm text-center qty-input"
                          value={it.qty || 1}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => updateQty(it.id, e.target.value)}
                          onBlur={(e) => updateQty(it.id, e.target.value)}
                        />

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => changeQty(it.id, it.qty, +1)}
                        >+</button>
                      </div>

                      <div className="fw-bold text-danger">
                        {currency(Number(it.price || 0) * Number(it.qty || 1))}
                      </div>
                    </div>

                    <div className="small text-muted mt-1">
                      Đơn giá: {currency(it.price)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="summary__coupon">
              <input className="summary__coupon-input" placeholder="Nhập mã giảm giá" />
              <button type="button" className="btn btn-outline-primary">Áp dụng</button>
            </div>

            <div className="summary__line">
              <span className="summary__muted">Tạm tính</span>
              <strong>{currency(subTotal)}</strong>
            </div>
            <div className="summary__line">
              <span className="summary__muted">Phí vận chuyển</span>
              <span className="summary__muted">Liên hệ</span>
            </div>
            <div className="summary__line">
              <span className="summary__muted">Mã giảm giá</span>
              <span>0đ</span>
            </div>

            <div className="summary__total">
              <span>TỔNG TIỀN</span>
              <span className="summary__total-value">{currency(subTotal)}</span>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-2" disabled={!items.length}>
              ĐẶT HÀNG
            </button>
            <label className="summary__terms">
              <input type="checkbox" className="form-check-input me-2" defaultChecked />
              Đặt hàng xong, shop sẽ liên hệ xác nhận. Không thanh toán online.
            </label>
          </aside>
        </div>
      </div>
    </form>
  );
}
