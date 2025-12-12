const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcrypt")

const db = new sqlite3.Database("./db/app_database.db")
const rounds = 10

async function insertCustomer(name, email, password, address, phone, gender, income) {
  return new Promise(async (resolve, reject) => {
    try {
      const hash = await bcrypt.hash(password, rounds)

      db.run(
        "INSERT INTO SiteUser (email, password) VALUES (?, ?)",
        [email, hash],
        function (err) {
          if (err) {
            return reject(err)
          }

          const custID = this.lastID

          db.run(
            "INSERT INTO Customer (userID, name, address, phone, gender, income) VALUES (?, ?, ?, ?, ?, ?)",
            [custID, name, address, phone, gender, income],
            (err) => {
              if (err) {
                return reject(err)
              }

              resolve(custID)
            }
          )
        }
      )
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = { insertCustomer }
