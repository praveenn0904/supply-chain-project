import { useState } from "react";
import { ethers } from "ethers";

import locations from "../data/india_states_districts.json";
import vegetables from "../data/vegetables";
import ResultCard from "./ResultCard";

// ✅ ABI JSON exported from Remix
import contractData from "../abis/SupplyChain.json";

// ✅ Contract address (Ganache / Remix Injected Provider)
const CONTRACT_ADDRESS = "0x6Ab5da74C7d69c40FFE0a08547435c7509b4367f";

// ✅ Correct ABI extraction
const CONTRACT_ABI = contractData.abi;

function PredictionForm() {
  const states = Object.keys(locations);

  const [fromState, setFromState] = useState("");
  const [fromDistrict, setFromDistrict] = useState("");
  const [toState, setToState] = useState("");
  const [toDistrict, setToDistrict] = useState("");
  const [vegetable, setVegetable] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [result, setResult] = useState(null);

  // 🔮 Predict + Store
  const submit = async () => {
    try {
      // 1️⃣ Call ML backend
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

      // 👉 Show result immediately (UX safe)
      setResult(data);

      // 2️⃣ MetaMask check
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 3️⃣ Contract instance
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      // 4️⃣ Store on blockchain
      const tx = await contract.storePrediction(
        data.vegetable,
        fromState,
        toState,
        data.delay_days,
        data.perish_days,
        data.risk
      );

      await tx.wait();
      console.log("✅ Prediction stored on blockchain");

    } catch (err) {
      console.error(err);
      alert("Prediction or blockchain transaction failed");
    }
  };

  // 🔍 Read latest prediction from blockchain
 

  return (
    <div className="form-container">
      <select onChange={e => setVegetable(e.target.value)}>
        <option value="">Select Vegetable</option>
        {vegetables.map(v => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      <input type="date" onChange={e => setHarvestDate(e.target.value)} />

      <h4>From</h4>
      <select onChange={e => setFromState(e.target.value)}>
        <option value="">Select State</option>
        {states.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {fromState && (
        <select onChange={e => setFromDistrict(e.target.value)}>
          <option value="">Select District</option>
          {locations[fromState].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      )}

      <h4>To</h4>
      <select onChange={e => setToState(e.target.value)}>
        <option value="">Select State</option>
        {states.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {toState && (
        <select onChange={e => setToDistrict(e.target.value)}>
          <option value="">Select District</option>
          {locations[toState].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      )}

      <button onClick={submit}>Predict & Store</button>
      

      {result && <ResultCard result={result} />}
    </div>
  );
}

export default PredictionForm;
