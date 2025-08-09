import React from "react";
import "./LaptopNeedsSection.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // import icon bootstrap

const CATEGORIES = [
  {
    id: "office",
    title: "HỌC TẬP, VĂN PHÒNG",
    image: "https://trungtran.vn/images/products/cat/resized/dm2_1673947421.webp",
    icons: ["bi-file-earmark-text", "bi-pen", "bi-globe2"],
    href: "/laptops?need=office",
  },
  {
    id: "design",
    title: "ĐỒ HỌA, KỸ THUẬT",
    image: "https://trungtran.vn/images/products/cat/resized/dm3_1673947441.webp",
    icons: ["bi-brush", "bi-vector-pen", "bi-cpu"],
    href: "/laptops?need=design",
  },
  {
    id: "dev",
    title: "LẬP TRÌNH",
    image: "https://trungtran.vn/images/products/cat/resized/dm4_1673947431.webp",
    icons: ["bi-code-slash", "bi-boxes", "bi-terminal"],
    href: "/laptops?need=dev",
  },
  {
    id: "gaming",
    title: "GAME",
    image: "https://trungtran.vn/images/products/cat/resized/dm1_1673947409.webp",
    icons: ["bi-controller", "bi-joystick", "bi-lightning-charge"],
    href: "/laptops?need=gaming",
  },
  {
    id: "flagship",
    title: "SIÊU PHẨM",
    image: "https://via.placeholder.com/300x200?text=Flagship",
    icons: ["bi-award", "bi-star", "bi-stars"],
    href: "/laptops?need=flagship",
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
