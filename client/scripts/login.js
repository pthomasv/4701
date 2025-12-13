async function handleLogin(event){
  event.preventDefault()

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
    // TODO (maybe): COMPLETE
    if (result.success) {
      localStorage.setItem('userID', result.user.userID)
      localStorage.setItem('role', result.user.role)
      if (result.user.role === 'user'){
        window.location.href = '../client/customer.html'
      } else if (result.user.role == 'empl') {
        window.location.href = '../client/employee.html'
      }
    } else {
      alert("Login Failed: " + result.message)
    }
  } catch (error) {
    console.error('Login error:', error)
  }
}