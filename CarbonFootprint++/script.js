// calculator.js
function calculateFootprint() {
    // Emission factors (metric)
    const factors = {
        car_gasoline: 2.31, // kg CO₂ per liter gasoline
        car_diesel: 2.68, // kg CO₂ per liter diesel
        flight_economy: 0.1,
        flight_business: 0.2,
        flight_first: 0.3,
        electricity: 0.45, // kg CO₂/kWh
        naturalGas: 2.0, // Approx kg CO₂ per m³
        meat: { beef: 65, lamb: 50, pork: 7, chicken: 6, fish: 11 },
        foodWaste: 0.5,
        garments: { cotton_shirt: 2.1, polyester_shirt: 3.5, pants: 5, jackets: 12 },
        electronics: -0.5
    };

    // Inputs
    const carKm = parseFloat(document.getElementById("carKm").value) || 0;
    const carL100 = parseFloat(document.getElementById("carL100").value) || 0;
    const carFuel = document.getElementById("carFuel").value;
    const flightKm = parseFloat(document.getElementById("flightKm").value) || 0;
    const flightClass = document.getElementById("flightClass").value;
    const monthlyWatts = parseFloat(document.getElementById("electricity").value) || 0;
    const naturalGas = parseFloat(document.getElementById("naturalGas").value) || 0;
    const beef = (parseFloat(document.getElementById("beef").value) || 0) * 365;
    const chicken = (parseFloat(document.getElementById("chicken").value) || 0) * 365;
    const lamb = (parseFloat(document.getElementById("lamb").value) || 0) * 365;
    const pork = (parseFloat(document.getElementById("pork").value) || 0) * 365;
    const fish = (parseFloat(document.getElementById("fish").value) || 0) * 365;
    const foodWaste = parseFloat(document.getElementById("foodWaste").value) || 0;
    const cottonShirt = parseFloat(document.getElementById("cottonShirt").value) || 0;
    const polyesterShirt = parseFloat(document.getElementById("polyesterShirt").value) || 0;
    const pants = parseFloat(document.getElementById("pants").value) || 0;
    const jackets = parseFloat(document.getElementById("jackets").value) || 0;
    const electronics = parseFloat(document.getElementById("electronics").value) || 0;

    // Calculations
    const litersConsumed = carKm ? (carKm * carL100 / 100) : 0;
    const carEmissions = litersConsumed * (carFuel === 'gasoline' ? factors.car_gasoline : factors.car_diesel);
    const flightEmissions = flightKm ? flightKm * factors['flight_' + flightClass] : 0;

    const electricity_kwh = (monthlyWatts * 24 * 30) / 1000; // Convert W → kWh/year
    const electricityEmissions = electricity_kwh * factors.electricity;
    const naturalGasEmissions = naturalGas * factors.naturalGas;
    const meatEmissions = beef * factors.meat.beef + chicken * factors.meat.chicken + lamb * factors.meat.lamb + pork * factors.meat.pork + fish * factors.meat.fish;
    const foodWasteEmissions = foodWaste * factors.foodWaste;
    const garmentsEmissions = cottonShirt * factors.garments.cotton_shirt + polyesterShirt * factors.garments.polyester_shirt + pants * factors.garments.pants + jackets * factors.garments.jackets;
    const electronicsEmissions = electronics * factors.electronics;

    const total = carEmissions + flightEmissions + electricityEmissions + naturalGasEmissions + meatEmissions + foodWasteEmissions + garmentsEmissions + electronicsEmissions;

    // Display results
    document.getElementById("results").style.display = "block";
    const bars = document.getElementById("bars");
    bars.innerHTML = '';
    const categories = {
        "Car": carEmissions,
        "Flights": flightEmissions,
        "Electricity": electricityEmissions,
        "Natural Gas": naturalGasEmissions,
        "Meat": meatEmissions,
        "Food Waste": foodWasteEmissions,
        "Garments": garmentsEmissions,
        "Electronics Recycling": electronicsEmissions
    };
    const max = Math.max(...Object.values(categories));
    for (let key in categories) {
        const perc = max ? (categories[key] / max * 100).toFixed(1) : 0;
        bars.innerHTML += `<label>${key}: ${categories[key].toFixed(2)} kg</label>
        <div class="bar-container"><div class="bar" style="width:${perc}%;background-color:${categories[key]<0?'#4caf50':'#00796b'}"></div></div>`;
    }

    document.getElementById("total").innerHTML = `<strong>Total Carbon Footprint:</strong> ${total.toFixed(2)} kg CO₂/year (${(total/1000).toFixed(2)} tons)`;

    // Tips
    let tips = [];
    if (carEmissions > 1000) tips.push("Consider carpooling or switching to electric vehicles.");
    if (flightEmissions > 500) tips.push("Reduce flights or choose economy class.");
    if (meatEmissions > 1000) tips.push("Consider reducing red meat consumption.");
    if (foodWasteEmissions > 100) tips.push("Compost or reduce food waste.");
    document.getElementById("tips").innerHTML = `<strong>Tips:</strong><br>${tips.join('<br>') || "Great job! Your footprint is low."}`;
}
