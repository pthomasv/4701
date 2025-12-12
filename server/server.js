const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const app = express()

const cors = require("cors"); //imports cors
const corsOptions ={
    origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"] //onlt accepts requests from these port
}
app.use(cors(corsOptions))
app.use(express.json())

app.get('/test', (req, res) => {
    res.json("hello world");
});

/* Login endpoint*/
app.post('/login', (req, res) => {
  const { email, password } = req.body
  const db = new sqlite3.Database('./db/app_database.db')
  db.get("SELECT * FROM User WHERE email = ? AND password = ?",
    [email, password],
    (err, u) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message })
        db.close()
        return
      }
      if (!u) {
        res.status(401).json({ success: false, message: "Invalid login" })
        db.close()
        return
      }
      if (u.role === "customer") {
        db.get("SELECT * FROM Customer WHERE userID = ?",
          [u.userID],
          (err, c) => {
            if (err) {
              res.status(500).json({ success: false, message: err.message })
            } else {
              res.json({ success: true, user: {userID: u.userID, email: u.email, role: u.role, name: c.name, address: c.address, phone: c.phone }})
            }
            db.close()
          }
        )
      } else if (user.role === "employee") {
        db.get("SELECT * FROM Employee WHERE userID = ?",
          [u.userID],
          (err, e) => {
            if (err) {
              res.status(500).json({ success: false, message: err.message })
            } else {
              res.json({ success: true, user: {userID: u.userID, email: u.email, role: u.role, name: e.name, dealerID: e.dealerID }})
            }
            db.close()
          }
        )
      }
    }
  )
})

app.get('/Customer', (req, res) => {
  const db = new sqlite3.Database('./db/app_database.db');
  
  db.all("SELECT * FROM Customer", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        customer: rows
      });
    }
  });

  db.close();
});

app.get("/api/dealership/:id", (req, res) => {
    const id = req.params.id;

    const dealershipQuery =
        "SELECT * FROM Dealership WHERE dealerID = ?";
    const carsQuery =
        "SELECT * FROM Cars WHERE dealerID = ?";

    db.get(dealershipQuery, [id], (err, dealer) => {
        if (err) return res.status(500).json({ error: err });

        db.all(carsQuery, [id], (err, cars) => {
            if (err) return res.status(500).json({ error: err });

            res.json({
                dealership: dealer,
                cars: cars
            });
        });
    });
});

function redirectCustomer(){
  window.location.href = "customer.html";
}



app.listen(3000, () => {
    console.log("Server started on port 3000")
})

