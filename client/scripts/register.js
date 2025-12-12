async function handleRegister(event) {
  event.preventDefault()

  const name = document.getElementById("fieldName").value
  const email = document.getElementById("fieldEmail").value
  const password = document.getElementById("fieldPassword").value
  const address = document.getElementById("fieldAddress").value
  const phone = document.getElementById("fieldPhone").value
  const gender = document.getElementById("fieldGender").value
  const income = document.getElementById("fieldIncome").value

  const data = {
    name,
    email,
    password,
    address,
    phone,
    gender,
    income
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
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
