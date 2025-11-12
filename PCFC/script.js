// calculator.js
function calculateFootprint() {
    // Emission factors (kg CO₂ per unit)
    const factors = {
        car: {
            gasoline: 2.31, // per liter
            diesel: 2.68
        },
        flight: {
            economy: 0.1, // per km
            business: 0.2,
            first: 0.3
        },
        electricity: 0.45, // per kWh
        naturalGas: 2.0, // per m³
        meat: { beef: 65, lamb: 50, pork: 7, chicken: 6, fish: 11 },
        foodWaste: 0.5, // per kg wasted
        garments: { cotton_shirt: 2.1, polyester_shirt: 3.5, pants: 5, jackets: 12 },
        electronics: -0.5 // credits for recycling
    };

    // Inputs
    const carKm = parseFloat(document.getElementById("carKm").value) || 0;
    const carL100 = parseFloat(document.getElementById("carL100").value) || 0;
    const carFuel = document.getElementById("carFuel").value;
    const flightKm = parseFloat(document.getElementById("flightKm").value) || 0;
    const flightClass = document.getElementById("flightClass").value;
    const monthlyWatts = parseFloat(document.getElementById("electricity").value) || 0;
    const naturalGas = parseFloat(document.getElementById("naturalGas").value) || 0;

    // Food habits
    const beef = (parseFloat(document.getElementById("beef").value) || 0) * 365;
    const chicken = (parseFloat(document.getElementById("chicken").value) || 0) * 365;
    const lamb = (parseFloat(document.getElementById("lamb").value) || 0) * 365;
    const pork = (parseFloat(document.getElementById("pork").value) || 0) * 365;
    const fish = (parseFloat(document.getElementById("fish").value) || 0) * 365;
    const foodWaste = parseFloat(document.getElementById("foodWaste").value) || 0;

    // Clothes & devices
    const cottonShirt = parseFloat(document.getElementById("cottonShirt").value) || 0;
    const polyesterShirt = parseFloat(document.getElementById("polyesterShirt").value) || 0;
    const pants = parseFloat(document.getElementById("pants").value) || 0;
    const jackets = parseFloat(document.getElementById("jackets").value) || 0;
    const electronics = parseFloat(document.getElementById("electronics").value) || 0;

    // --- Calculations ---
    const litersConsumed = (carKm * carL100) / 100;
    const carEmissions = litersConsumed * (carFuel === 'gasoline' ? factors.car.gasoline : factors.car.diesel);

    const flightEmissions = flightKm * (factors.flight[flightClass] || 0);

    // Convert watts (power) to annual kWh — assume user enters average daily watts
    const electricity_kwh_year = (monthlyWatts * 24 * 365) / 1000;
    const electricityEmissions = electricity_kwh_year * factors.electricity;

    const naturalGasEmissions = naturalGas * factors.naturalGas;

    const meatEmissions =
        beef * factors.meat.beef +
        chicken * factors.meat.chicken +
        lamb * factors.meat.lamb +
        pork * factors.meat.pork +
        fish * factors.meat.fish;

    const foodWasteEmissions = foodWaste * factors.foodWaste;

    const garmentsEmissions =
        cottonShirt * factors.garments.cotton_shirt +
        polyesterShirt * factors.garments.polyester_shirt +
        pants * factors.garments.pants +
        jackets * factors.garments.jackets;

    const electronicsEmissions = electronics * factors.electronics;

    const total =
        carEmissions +
        flightEmissions +
        electricityEmissions +
        naturalGasEmissions +
        meatEmissions +
        foodWasteEmissions +
        garmentsEmissions +
        electronicsEmissions;

    // --- Display ---
    const results = document.getElementById("results");
    results.style.display = "block";

    // Clear and rebuild bar chart
    const bars = document.getElementById("bars");
    bars.innerHTML = "";

    const categories = {
        "Car": carEmissions,
        "Flights": flightEmissions,
        "Electricity": electricityEmissions,
        "Natural Gas": naturalGasEmissions,
        "Meat": meatEmissions,
        "Food Waste": foodWasteEmissions,
        "Garments": garmentsEmissions,
        "Electronics": electronicsEmissions
    };

    const maxValue = Math.max(...Object.values(categories), 1);
    for (const [key, value] of Object.entries(categories)) {
        const percent = ((value / maxValue) * 100).toFixed(1);
        const color = value < 0 ? "#4caf50" : "#00796b";
        bars.innerHTML += `
            <label>${key}: ${value.toFixed(2)} kg CO₂/year</label>
            <div class="bar-container">
                <div class="bar" style="width:${percent}%; background-color:${color}"></div>
            </div>`;
    }

    document.getElementById("total").innerHTML =
        `<strong>Total Carbon Footprint:</strong> ${total.toFixed(2)} kg CO₂/year 
        (${(total / 1000).toFixed(2)} tons)`;

    // --- Tips ---
    const tips = [];
    if (carEmissions > 1000) tips.push("🚗 Try carpooling, biking, or switching to an EV.");
    if (flightEmissions > 500) tips.push("✈️ Consider reducing air travel or flying economy.");
    if (meatEmissions > 1000) tips.push("🥩 Try reducing red meat (beef/lamb) intake.");
    if (foodWasteEmissions > 100) tips.push("🍃 Reduce food waste or start composting.");
    if (electricityEmissions > 800) tips.push("💡 Switch to energy-efficient appliances or solar.");

    document.getElementById("tips").innerHTML =
        `<strong>Tips:</strong><br>${tips.length ? tips.join("<br>") : "🌍 Great job! Your footprint is low."}`;
}