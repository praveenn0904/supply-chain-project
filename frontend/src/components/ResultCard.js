function ResultCard({ result }) {
  return (
    <div className="result-card">
      <h3>Prediction Result</h3>
      <p><b>Vegetable:</b> {result.vegetable}</p>
      <p><b>Transport Type:</b> {result.transport_type}</p>
      <p><b>Delay Days:</b> {result.delay_days}</p>
      <p><b>Perish Days:</b> {result.perish_days}</p>
      <p><b>Perish Date:</b> {result.perish_date}</p>
      <p><b>Risk:</b> {result.risk}</p>
    </div>
  );
}

export default ResultCard;
