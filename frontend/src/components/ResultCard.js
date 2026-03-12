function ResultCard({ result }) {

  const getRiskColor = () => {
    if (result.risk === "HIGH") return "#ff4d4f";
    if (result.risk === "MEDIUM") return "#faad14";
    return "#52c41a";
  };

  return (
    <div className="result-card" style={{
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "16px",
      marginTop: "20px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      background: "#fff"
    }}>

      <h3>📦 Prediction Result</h3>

      <p><b> Vegetable:</b> {result.vegetable}</p>
      <p><b> Transport Type:</b> {result.transport_type}</p>
      <p><b> Delay Days:</b> {result.delay_days}</p>
      <p><b> Perish Days:</b> {result.perish_days}</p>
      <p><b> Perish Date:</b> {result.perish_date}</p>

      <p>
        <b>Risk Level:</b>{" "}
        <span style={{
          color: "#fff",
          background: getRiskColor(),
          padding: "4px 10px",
          borderRadius: "8px",
          fontWeight: "bold"
        }}>
          {result.risk}
        </span>
      </p>

      {/* Alert Message */}
      {result.alert && (
        <div style={{
          marginTop: "10px",
          padding: "10px",
          borderRadius: "8px",
          background:
            result.risk === "HIGH"
              ? "#fff1f0"
              : result.risk === "MEDIUM"
              ? "#fffbe6"
              : "#f6ffed",
          color: "#333"
        }}>
          ⚠ {result.alert}
        </div>
      )}

      {/* Timestamp */}
      {result.timestamp && (
        <p style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
           Generated: {new Date(result.timestamp).toLocaleString()}
        </p>
      )}

    </div>
  );
}

export default ResultCard;