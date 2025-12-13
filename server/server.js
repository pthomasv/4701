const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt')
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
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const db = new sqlite3.Database('./db/app_database.db');
  
  db.get("SELECT userID, password, role FROM SiteUser WHERE email = ?",
    [email],
    async (err, u) => {
      if (err) {
        res.status(500).json({ success: false, message: err.message });
        db.close();
        return;
      }
      if (!u) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        db.close();
        return;
      }
      
      try {
        const isMatch = await bcrypt.compare(password, u.password);
        
        if (!isMatch) {
          res.status(401).json({ success: false, message: "Invalid email or password" });
          db.close();
          return;
        }
        
        // Password is correct, get role-specific data
        if (u.role === "user") {
          db.get("SELECT * FROM Customer WHERE userID = ?",
            [u.userID],
            (err, c) => {
              if (err) {
                res.status(500).json({ success: false, message: err.message });
              } else {
                res.json({ success: true, user: { userID: u.userID, email: email, role: u.role, name: c.name, address: c.address, phone: c.phone, gender: c.gender, income: c.income } });
              }
              db.close();
            }
          );
        } else if (u.role === "empl") {
          db.get("SELECT * FROM Employee WHERE userID = ?",
            [u.userID],
            (err, e) => {
              if (err) {
                res.status(500).json({ success: false, message: err.message });
              } else {
                res.json({ success: true, user: { userID: u.userID, email: email, role: u.role, name: e.name, dealerID: e.dealerID } });
              }
              db.close();
            }
          );
        } else {
          res.status(500).json({ success: false, message: "Unknown user role" });
          db.close();
        }
        
      } catch (bcryptErr) {
        res.status(500).json({ success: false, message: "Error verifying password" });
        db.close();
      }
    }
  );
});

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
    const userID = await insertCustomer(name, email, password, address, phone, gender, income)

    res.status(201).json({ success: true, message: "Registration successful", user: {userID: userID, role: 'user'}})
  } catch (err) {
    console.error(err)
    res.status(500).json({
      success: false,
      error: "Registration failed"
    })
  }
})

app.post('/purchase', (req, res) => {
  const { VIN, userID, price } = req.body;
  
  if (!VIN || !userID || !price) {
    console.log('Missing fields:', { VIN, userID, price });
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  
  const db = new sqlite3.Database('./db/app_database.db', (err) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({ success: false, message: "Database connection failed" });
    }
  });
  
  db.get("SELECT dealerID FROM Vehicle WHERE VIN = ?", [VIN], (err, vehicle) => {
    if (err) {
      console.error('Query error:', err);
      db.close();
      return res.status(500).json({ success: false, message: "Database query failed: " + err.message });
    }
    
    console.log('Vehicle found:', vehicle);
    
    if (!vehicle) {
      db.close();
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }
    
    if (!vehicle.dealerID) {
      db.close();
      return res.status(400).json({ success: false, message: "Vehicle already sold" });
    }
    
    const dealerID = vehicle.dealerID;
    const today = new Date().toISOString().split('T')[0];
    
    console.log('Creating deal:', { today, userID, dealerID, VIN, price });
    
    db.run(
      "INSERT INTO Deals (date_of_deal, bought_by, sold_by, VIN, price) VALUES (?, ?, ?, ?, ?)",
      [today, userID, dealerID, VIN, price],
      function(err) {
        if (err) {
          console.error('Insert deal error:', err);
          db.close();
          return res.status(500).json({ success: false, message: "Failed to create deal: " + err.message });
        }
        
        console.log('Deal created, ID:', this.lastID);
        
        db.run("UPDATE Vehicle SET dealerID = NULL WHERE VIN = ?", [VIN], (err) => {
          if (err) {
            console.error('Update vehicle error:', err);
            db.close();
            return res.status(500).json({ success: false, message: "Failed to update vehicle: " + err.message });
          }
          
          console.log('Purchase successful!');
          res.json({ success: true, message: "Purchase successful", dealID: this.lastID });
          db.close();
        });
      }
    );
  })
});

app.post('/modify', (req, res) => {
  const { vin, price } = req.body;

  const db = new sqlite3.Database('./db/app_database.db');

  db.run(
    `UPDATE Vehicle
     SET price = ?
     WHERE VIN = ?`,
    [price, vin],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: "VIN not found" });
      } else {
        res.json({
          success: true,
          VIN: vin,
          newPrice: price
        });
      }
    }
  );

  db.close();
});


app.post('/delete', (req, res) => {
  const { vin } = req.body;

  const db = new sqlite3.Database('./db/app_database.db');

  db.serialize(() => {
    //  Delete dependent Options row first
    db.run(
      `DELETE FROM Options WHERE VIN = ?`,
      [vin],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        db.run(
          `DELETE FROM Vehicle WHERE VIN = ?`,
          [vin],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
              res.status(404).json({ error: "VIN not found" });
            } else {
              res.json({
                success: true,
                VIN: vin
              });
            }
          }
        );
      }
    );
  });

  db.close();
});


app.post('/add', (req, res) => {
  const { vin, plantID, brandID, color, engine, transmission } = req.body;

  const db = new sqlite3.Database('./db/app_database.db');

  db.serialize(() => {
    db.run(
      `INSERT INTO Vehicle (VIN, plantID, brandID)
       VALUES (?, ?, ?)`,
      [vin, plantID, brandID],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        db.run(
          `INSERT INTO Options (VIN, color, engine, transmission)
           VALUES (?, ?, ?, ?)`,
          [vin, color, engine, transmission],
          function (err) {
            if (err) {
              res.status(500).json({ error: err.message });
            } else {
              res.json({ success: true, VIN: vin });
            }
          }
        );
      }
    );
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

app.listen(3000, () => {
    console.log("Server started on port 3000")
})