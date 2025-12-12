async function handleLogin(event){
  event.preventDefault()

  console.log("asd")

  const email = document.getElementById("fieldEmail").value
  const password = document.getElementById("fieldPassword").value

  const data = { email, password }

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    if (result.success) {
      localStorage.setItem('user')
    }



  } catch (error) {
    console.error('Login error:', error)
  }
}