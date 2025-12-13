async function handleModify(event) {
  event.preventDefault()

  const vin = document.getElementById("modifyVin").value
  const price = document.getElementById("modifyPrice").value

  const data = {
    vin,
    price
  }

  try {
    const response = await fetch("http://localhost:3000/modify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    console.log(result)
  } catch (err) {
    console.error("Register error:", err)
  }
}

async function handleAdd(event) {
  event.preventDefault();

  const vin = document.getElementById("addVin").value;
  const color = document.getElementById("fieldColor").value;
  const engine = document.getElementById("fieldEngine").value;
  const transmission = document.getElementById("fieldTransmission").value;

  const plantID = 1;   
  const brandID = 1;  

  const data = {
    vin,
    plantID,
    brandID,
    color,
    engine,
    transmission,
  };

  try {
    const response = await fetch("http://localhost:3000/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error("Add error:", err);
  }
}

async function handleDelete(event) {
  event.preventDefault()

  const vin = document.getElementById("addVin").value

  const data = {
    vin
  }

  try {
    const response = await fetch("http://localhost:3000/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    console.log(result)
  } catch (err) {
    console.error("Register error:", err)
  }
}

