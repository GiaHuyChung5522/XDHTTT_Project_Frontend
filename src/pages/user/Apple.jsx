import React from "react";
import ProductList from "./ProductList";             // cùng folder pages/user
import ProductCard from "../../components/ProductCard";
import ProductItem from "./ProductItem";

export default function ApplePage() {
  return (
    <div className="home-container">
      {/* List 1: Dòng máy Apple */}
      <ProductList
        title="Apple"
        tabs={["Macbook", "iMac", "Mac Mini"]}
        fixedQ="Apple"
        totalOverride={75}
        itemRenderer={(p) => <ProductItem product={p} />}
      />

      {/* List 2: Phụ kiện Apple – card khác */}
      <ProductList
        title="Phụ kiện Apple"
        tabs={["AirPods", "Magic Mouse", "Magic Keyboard"]}
        fixedQ="Apple Accessory"
        itemRenderer={(p) => (
          <ProductCard
            badge={p.badge}
            image={p.image || "/src/assets/img/sanpham1.jpg"}
            name={p.name}
            price={Number(p.price || 0)}
            version={p.version || "1 phiên bản"}
          />
        )}
      />
    </div>
  );
}
