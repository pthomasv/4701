async function loadData() {
    const res = await fetch("http://localhost:3000/home");
    const data = await res.json();

    // data is an array of dealerships
    const dealer = data.find(d => d.dealerID === DEALER_ID) || data[0];
    const cars = dealer.vehicles || [];

    // Display dealership
    document.getElementById("dealership-info").innerHTML = `
      <p><strong>Name:</strong> ${dealer.name}</p>
      <p><strong>Address:</strong> ${dealer.address}</p>
      <hr>
    `;

    // Display cars
    let html = "<ul>";
    cars.forEach(car => {
        html += `
            <li>
                ${car.model_name} — $${car.price}
            </li>
        `;
    });
    html += "</ul>";

    document.getElementById("car-list").innerHTML = html;
}