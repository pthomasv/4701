const express = require('express')
const sqlite3 = require('sqlite3').verbose();
const app = express()

const cors = require("cors"); //imports cors
const corsOptions ={
    origin: ["http://127.0.0.1:5501", "http://127.0.0.1:5500"] //onlt accepts requests from these port
}
app.use(cors(corsOptions))

app.get('/test', (req, res) => {
    res.json("hello world");
  
});

app.get('/Customer', (req, res) => {
  const db = new sqlite3.Database('./app_database.db');
  
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

app.listen(3000, () => {
    console.log("Server started on port 3000")
})

