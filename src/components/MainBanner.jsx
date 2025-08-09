import "../assets/styles/Banner.css";

const MainBanner = () => {
  const banners = [
    "https://trungtran.vn/images/slideshow/2025/07/01/original/banner-web-lenovo_1751345115.webp",
    "https://trungtran.vn/images/slideshow/2025/07/01/original/banner-web-lenovo_1751345115.png",
    "https://trungtran.vn/images/slideshow/2025/07/01/original/banner-web-lenovo_1751345115.webp"
  ];

  return (
    <div className="main-banner-container">
      <div
        id="mainBannerCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {banners.map((src, idx) => (
            <div
              key={idx}
              className={`carousel-item ${idx === 0 ? "active" : ""}`}
            >
              <img
                src={src}
                alt={`banner-${idx}`}
                className="d-block w-100 main-banner__image"
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#mainBannerCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Trước</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#mainBannerCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Sau</span>
        </button>

        <div className="carousel-indicators">
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#mainBannerCarousel"
              data-bs-slide-to={idx}
              className={idx === 0 ? "active" : ""}
              aria-current={idx === 0 ? "true" : "false"}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
