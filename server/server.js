const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const { insertCustomer } = require("./db/customer")
const app = express()

const cors = require("cors"); //imports cors
const corsOptions ={
    origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"] //onlt accepts requests from these port
}
app.use(cors(corsOptions))
app.use(express.json())

app.get('/test', (req, res) => {
    res.json("hello worldhh");
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

app.get("/home", (req, res) => {
    const db = new sqlite3.Database('./db/app_database.db')
    const dealershipsQuery = "SELECT dealerID, name, address FROM Dealership";
    const vehiclesQuery = "SELECT VIN, model_name, price, dealerID FROM Vehicle";

    db.all(dealershipsQuery, [], (err, dealerships) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: err.message });
        }

        db.all(vehiclesQuery, [], (err, vehicles) => {
            if (err) {
                db.close();
                return res.status(500).json({ error: err.message });
            }

            const result = dealerships.map(dealer => ({
                name: dealer.name,
                address: dealer.address,
                vehicles: vehicles
                    .filter(vehicle => vehicle.dealerID === dealer.dealerID)
                    .map(vehicle => ({
                        VIN: vehicle.VIN,
                        model_name: vehicle.model_name,
                        price: vehicle.price
                    }))
            }));

            db.close();
            res.json(result);
        });
    });
});



app.post('/register', async (req, res) => {
  const {
    name = "",
    email = "peter@gmail.com",
    password = "",
    address = "",
    phone = "",
    gender = "",
    income = 0
  } = req.body

  try {
    await insertCustomer(
      name,
      email,
      password,
      address,
      phone,
      gender,
      income
    )

    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      error: "Registration failed"
    })
  }
})


app.listen(3000, () => {
    console.log("Server started on port 3000")
})

