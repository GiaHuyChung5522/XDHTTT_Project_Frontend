import newsList from "../data/news.json";
import "../assets/NewsPanel.css"; // Import file CSS đã được tách

const NewsPanel = () => {
  return (
    <div className="news-panel">
      <h2 className="news-panel__title">
        TIN MỚI NHẤT
      </h2>

      <div className="news-panel__list-wrapper">
        <ul className="news-panel__list">
          {newsList.map((item, index) => {
            // Tạo một chuỗi các lớp động sử dụng BEM
            const itemClasses = `news-panel__item ${item.active ? 'news-panel__item--active' : ''}`;

            return (
              <li key={index} className={itemClasses}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="news-panel__image"
                />
                <div className="news-panel__info">
                  <p className="news-panel__item-title">
                    {item.title}
                  </p>
                  <p className="news-panel__meta">
                    {item.date} · {item.views} views
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="news-panel__footer">
        <a href="#">Tất cả tin tức &rarr;</a>
      </div>
    </div>
  );
};

export default NewsPanel;
