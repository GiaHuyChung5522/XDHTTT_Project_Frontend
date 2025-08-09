import React from "react";
import "./FilterTabsHeader.css";

export default function FilterTabsHeader({
  title,
  options = [],        // string[] hoặc {label, image?}[]
  value = "",
  onChange = () => {},
  total = 0,
  viewAll = true,
  className = "",
}) {
  // Chuẩn hoá options: chấp nhận string hoặc object
  const opts = options.map((o) =>
    typeof o === "string" ? { label: o } : o
  );

  return (
    <div className={`filter-header ${className}`}>
      <h2 className="filter-header__title">{title}</h2>

      <nav className="filter-header__tabs" aria-label="Bộ lọc">
        {opts.map((opt) => (
          <button
            key={opt.label}
            type="button"
            className={`filter-tab ${value === opt.label ? "is-active" : ""}`}
            onClick={() => onChange(opt.label)}
          >
            {opt.image && (
              <img src={opt.image} alt="" className="filter-tab__icon" />
            )}
            {opt.label}
          </button>
        ))}

        {viewAll && (
          <button
            type="button"
            className="filter-tab filter-tab--all"
            onClick={() => onChange("")}
          >
            Xem tất cả ({total})
          </button>
        )}
      </nav>
    </div>
  );
}
