async function handleRegister(event){
  event.preventDefault()


  const fname = document.getElementById("fieldFname").value
  const lname = document.getElementById("fieldLname").value

  const email = document.getElementById("fieldEmail").value
  const password = document.getElementById("fieldPassword").value
  const pnumber = document.getElementById("fieldPnumber").value

  const passwordhashed = generateHash(password)

  const data = { fname, lname, pnumber, email, passwordhashed }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const result = await response.json()

  } catch (error) {
    console.error('Register  error:', error)
  }
}
