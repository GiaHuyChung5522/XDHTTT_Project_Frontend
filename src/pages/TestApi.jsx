import { useEffect, useState } from "react";

export default function TestApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        console.log("Dữ liệu nhận từ API:", json);
        setData(json);
      })
      .catch((err) => {
        console.error("Lỗi gọi API:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Test API Proxy</h2>
      {error && <div style={{ color: "red" }}>Lỗi: {error}</div>}
      {data ? (
        <pre
          style={{
            background: "#f4f4f4",
            padding: 10,
            borderRadius: 5,
            maxHeight: 300,
            overflow: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
