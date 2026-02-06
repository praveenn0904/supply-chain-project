import { useState } from "react";
import locations from "../data/india_states_districts.json";
import vegetables from "../data/vegetables";
import ResultCard from "./ResultCard";

function PredictionForm() {
  const states = Object.keys(locations);

  const [fromState, setFromState] = useState("");
  const [fromDistrict, setFromDistrict] = useState("");
  const [toState, setToState] = useState("");
  const [toDistrict, setToDistrict] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [result, setResult] = useState(null);

  const submit = async () => {
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from_state: fromState,
        from_district: fromDistrict,
        to_state: toState,
        to_district: toDistrict,
        vegetable,
        harvest_date: harvestDate
      })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="form-container">

      <select onChange={e => setVegetable(e.target.value)}>
        <option value="">Select Vegetable</option>
        {vegetables.map(v => <option key={v}>{v}</option>)}
      </select>

      <input type="date" onChange={e => setHarvestDate(e.target.value)} />

      <h4>From</h4>
      <select onChange={e => setFromState(e.target.value)}>
        <option value="">Select State</option>
        {states.map(s => <option key={s}>{s}</option>)}
      </select>

      {fromState && (
        <select onChange={e => setFromDistrict(e.target.value)}>
          <option value="">Select District</option>
          {locations[fromState].map(d => <option key={d}>{d}</option>)}
        </select>
      )}

      <h4>To</h4>
      <select onChange={e => setToState(e.target.value)}>
        <option value="">Select State</option>
        {states.map(s => <option key={s}>{s}</option>)}
      </select>

      {toState && (
        <select onChange={e => setToDistrict(e.target.value)}>
          <option value="">Select District</option>
          {locations[toState].map(d => <option key={d}>{d}</option>)}
        </select>
      )}

      <button onClick={submit}>Predict & Store</button>

      {result && <ResultCard result={result} />}
    </div>
  );
}

export default PredictionForm;
