const DEALER_ID = 1;

async function loadData() {
    const res = await fetch(``);
    const data = await res.json();

    const dealer = data.dealership;
    const cars = data.cars;

    // Display dealership
    document.getElementById("dealership-info").innerHTML = `
        <p><strong>Name:</strong> ${dealer.name}</p>
        <p><strong>Address:</strong> ${dealer.address}</p>
        <p><strong>Capacity:</strong> ${dealer.capacity}</p>
        <hr>
    `;

    // Display cars
    let html = "<ul>";
    cars.forEach(car => {
        html += `
            <li>
                ${car.year} ${car.make} ${car.model} — $${car.price}
            </li>
        `;
    });
    html += "</ul>";

    document.getElementById("car-list").innerHTML = html;
}

loadData();