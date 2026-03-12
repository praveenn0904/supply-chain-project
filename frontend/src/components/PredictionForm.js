import { useState } from "react";
import { ethers } from "ethers";

import locations from "../data/india_states_districts.json";
import vegetables from "../data/vegetables";
import districtCoordinates from "../data/districtCoordinates";
import contractData from "../abis/SupplyChain.json";

import "../styles/styles.css";

const CONTRACT_ADDRESS = "0x6Ab5da74C7d69c40FFE0a08547435c7509b4367f";
const CONTRACT_ABI = contractData.abi;

function PredictionForm(){

const states = Object.keys(locations)

const [vegetable,setVegetable] = useState("")
const [harvestDate,setHarvestDate] = useState("")
const [transportDate,setTransportDate] = useState("")

const [fromState,setFromState] = useState("")
const [toState,setToState] = useState("")

const [fromDistrict,setFromDistrict] = useState("")
const [toDistrict,setToDistrict] = useState("")

const [results,setResults] = useState([])
const [distance,setDistance] = useState(null)
const [perishAlert,setPerishAlert] = useState(null)
const [risk,setRisk] = useState("")   // NEW STATE

const formatDate=(date)=>{

const d = new Date(date)

const day = String(d.getDate()).padStart(2,"0")
const month = String(d.getMonth()+1).padStart(2,"0")
const year = d.getFullYear()

return `${day}-${month}-${year}`

}

const getPerishDays=(veg)=>{

const map={
Tomato:7,
Potato:20,
Onion:25,
Carrot:10,
Cabbage:14,
Cauliflower:10,
Brinjal:6,
Cucumber:5,
Capsicum:7,
Beans:5,
Peas:6,
Spinach:3,
Lettuce:4,
Radish:7,
Beetroot:12,
Pumpkin:30,
BottleGourd:8,
BitterGourd:6,
Drumstick:4,
Okra:5,
GreenChilli:8,
Banana:5,
Apple:30
}

return map[veg] || 10

}

function calculateDistance(lat1, lon1, lat2, lon2){

const R = 6371

const dLat = (lat2-lat1) * Math.PI/180
const dLon = (lon2-lon1) * Math.PI/180

const a =
Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLon/2) * Math.sin(dLon/2)

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

return R * c

}

function getTransportDays(distance){

if(distance <= 300) return 1
if(distance >=301&& distance <= 600) return 2
if(distance > 600 && distance <= 900) return 3
return 4

}

const submit = async()=>{

if(!vegetable || !harvestDate || !transportDate || !fromDistrict || !toDistrict){

alert("Fill all fields")
return

}

const perishDays = getPerishDays(vegetable)

const harvest = new Date(harvestDate)
const transport = new Date(transportDate)

const from = districtCoordinates[fromDistrict]
const to = districtCoordinates[toDistrict]

const dist = calculateDistance(from.lat,from.lon,to.lat,to.lon)

setDistance(dist.toFixed(2))

const delayDays = getTransportDays(dist)

const harvestDelayDays = Math.ceil(
(transport - harvest) / (1000 * 60 * 60 * 24)
)

const totalDelay = harvestDelayDays + delayDays +2

const wholesalerDate = new Date(transport)
wholesalerDate.setDate(transport.getDate()+delayDays)

const retailerDate = new Date(wholesalerDate)
retailerDate.setDate(wholesalerDate.getDate()+1)

const consumerDate = new Date(retailerDate)
consumerDate.setDate(retailerDate.getDate()+1)

const perishDate = new Date(harvest)
perishDate.setDate(harvest.getDate()+perishDays)

if(perishDate < consumerDate){

setPerishAlert({

product:vegetable,
perishDate:formatDate(perishDate),
consumerDate:formatDate(consumerDate),
distance:dist.toFixed(2)

})

}
else{

setPerishAlert(null)

}

/* AI prediction */

const res = await fetch("http://localhost:5000/predict",{

method:"POST",
headers:{ "Content-Type":"application/json" },

body:JSON.stringify({

perish_days:perishDays,
delay_days:totalDelay

})

})

const data = await res.json()

setRisk(data.risk)   // SAVE RISK

const stageResults=[

{
stage:"Harvest → Transportation",
date:formatDate(transport)
},

{
stage:"Transportation → Wholesaler",
date:formatDate(wholesalerDate)
},

{
stage:"Wholesaler → Retailer",
date:formatDate(retailerDate)
},

{
stage:"Retailer → Consumer",
date:formatDate(consumerDate)
},

{
stage:"Perish Date",
date:formatDate(perishDate)
}

]

setResults(stageResults)

try{

if(!window.ethereum){

alert("Install MetaMask")
return

}

await window.ethereum.request({method:"eth_requestAccounts"})

const provider = new ethers.BrowserProvider(window.ethereum)
const signer = await provider.getSigner()

const contract = new ethers.Contract(
CONTRACT_ADDRESS,
CONTRACT_ABI,
signer
)

const tx = await contract.storePrediction(

vegetable,
fromState,
toState,
delayDays,
perishDays,
data.risk

)

await tx.wait()

alert("Prediction stored on blockchain")

}
catch(err){

console.log(err)

}

}

return(

<div className="page">

<div className="form-container">

<h2>Supply Chain Prediction</h2>

<div className="form-group">

<label>Vegetable</label>

<select onChange={e=>setVegetable(e.target.value)}>
<option>Select Vegetable</option>

{vegetables.map(v=>(
<option key={v}>{v}</option>
))}

</select>

</div>

<div className="form-group">

<label>Harvest Date</label>

<input type="date" onChange={e=>setHarvestDate(e.target.value)}/>

</div>

<div className="form-group">

<label>Transportation Date</label>

<input type="date" onChange={e=>setTransportDate(e.target.value)}/>

</div>

<div className="form-group">

<label>From State</label>

<select onChange={e=>setFromState(e.target.value)}>
<option>Select From State</option>

{states.map(s=>(
<option key={s}>{s}</option>
))}

</select>

</div>

<div className="form-group">

<label>From District</label>

<select onChange={e=>setFromDistrict(e.target.value)}>
<option>Select From District</option>

{fromState && locations[fromState].map(d=>(
<option key={d}>{d}</option>
))}

</select>

</div>

<div className="form-group">

<label>To State</label>

<select onChange={e=>setToState(e.target.value)}>
<option>Select To State</option>

{states.map(s=>(
<option key={s}>{s}</option>
))}

</select>

</div>

<div className="form-group">

<label>To District</label>

<select onChange={e=>setToDistrict(e.target.value)}>
<option>Select To District</option>

{toState && locations[toState].map(d=>(
<option key={d}>{d}</option>
))}

</select>

</div>

<button className="predict-btn" onClick={submit}>
Predict Supply Chain
</button>

{risk && (

<h3 style={{marginTop:"20px"}}>

Overall Risk : {risk}

</h3>

)}

{perishAlert && (

<div className="alert-card">

<h3>⚠ Perish Warning</h3>

<p><b>{perishAlert.product}</b> will perish before reaching consumer</p>

<p>Distance: <b>{perishAlert.distance} km</b></p>

<p>Perish Date: <b>{perishAlert.perishDate}</b></p>

<p>Expected Delivery: <b>{perishAlert.consumerDate}</b></p>

</div>

)}

{!perishAlert && distance && (

<div>

<h3>Distance Between Districts</h3>

<p>{distance} km</p>

</div>

)}

{!perishAlert && (

<>

<h3 className="timeline-title">Supply Chain Timeline</h3>

<div className="results">

{results.map((r,i)=>(

<div className="result-card" key={i}>

<h4>{r.stage}</h4>

<p>Date: {r.date}</p>

</div>

))}

</div>

</>

)}

</div>

</div>

)

}

export default PredictionForm