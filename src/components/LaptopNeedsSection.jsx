import React from "react";
import "./LaptopNeedsSection.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // import icon bootstrap
import laptopSieuPham from "../assets/img/laptopSieuPham.jpg";

const CATEGORIES = [
  {
    id: "office",
    title: "Laptop văn phòng",
    image: "https://trungtran.vn/images/products/cat/resized/dm2_1673947421.webp",
    icons: ["bi-file-earmark-text", "bi-pen", "bi-globe2"],
    href: "/products?category=laptop-van-phong",
  },
  {
    id: "gaming",
    title: "Laptop gaming",
    image: "https://trungtran.vn/images/products/cat/resized/dm1_1673947409.webp",
    icons: ["bi-controller", "bi-joystick", "bi-lightning-charge"],
    href: "/products?category=laptop-gaming",
  },
];

export default function LaptopNeedsSection() {
  return (
    <section className="home__product-showcase">
      <h2 className="section-title">Laptop theo nhu cầu</h2>
      <div className="cards-grid --5">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="card-col">
            <a href={c.href} className="need-card text-decoration-none">
              <div className="need-card__img">
                <img src={c.image} alt={c.title} loading="lazy" />
              </div>
              <div className="need-card__icons">
                {c.icons.map((icon, i) => (
                  <i key={i} className={`bi ${icon} fs-4`}></i>
                ))}
              </div>
              <div className="need-card__title">{c.title}</div>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
