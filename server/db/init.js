const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const rounds = 10;

// Create or open the database
const db = new sqlite3.Database('./app_database.db');

// Create a table (if it doesn't exist)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Company (
      companyID int,
      name varchar(256),

      primary key (companyID)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Brand (
      brandID int, 
      name varchar(256), 
      companyID int not null, 

      primary key (brandID), 
      foreign key (companyID) references Company
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Supplier (
      supplyID int, 
      name varchar(256), 
      address varchar(256), 

      primary key (supplyID)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Plant (
      plantID int, 
      name varchar(256), 
      address varchar(256), 
      companyID int not null, 

      primary key (plantID), 
      foreign key (companyID) references Company
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Provides (
      plantID int not null, 
      supplyID int not null, 

      primary key (plantID, supplyID), 
      foreign key (plantID) references Plant, 
      foreign key (supplyID) references Supplier
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Vehicle (
      VIN int, 
      model_name varchar(256), 
      price int,
      plantID int not null, 
      brandID int not null, 
      dealerID int, 

      primary key (VIN), 
      foreign key (plantID) references Plant, 
      foreign key (brandID) references Brand, 
      foreign key (dealerID) references Dealership
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Options (
      color varchar(256), 
      engine varchar(256), 
      transmission varchar(256), 
      VIN int, 

      primary key (VIN), 
      foreign key (VIN) references Vehicle
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS SiteUser (
      userID INTEGER PRIMARY KEY AUTOINCREMENT,
      email	varchar(256) unique not null,
      password varchar(256) not null,
      role char(4) default 'user'
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Customer (
      userID int,
      name varchar(256),
      address varchar(256),
      phone varchar(256),
      gender varchar(256),
      income int,

      primary key (userID),
      foreign key (userID) references SiteUser
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Employee (
      userID int,
      name varchar(256),
      dealerID int,

      primary key (userID),
      foreign key (userID) references SiteUser,
      foreign key (dealerID) references Dealership
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Dealership (
      dealerID int,
      name varchar(256),
      address varchar(256),
      capacity int,

      primary key (dealerID)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Deals (
      dealID INTEGER PRIMARY KEY AUTOINCREMENT,
      date_of_deal date,
      bought_by int not null,
      sold_by int not null,
      VIN int not null,
      price int,

      foreign key (bought_by) references Customer(userID),
      foreign key (sold_by) references Dealership(dealerID),
      foreign key (VIN) references Vehicle
    );
  `);

  // Starter Customer
  // const stmt = db.prepare("INSERT INTO Customer VALUES (?, ?, ?, ?, ?, ?)");
  // stmt.run(1, 'John Doe', 'john@example.com', '911', 'male', 100);
  // stmt.run(2, 'Jane Smith', 'jane@example.com', '112', 'female', 120);
  // stmt.run(3, 'Bob Wilson', 'bob@example.com', '211', 'male', 90);
  // stmt.finalize();
});

async function insertCustomer(name, email, password, address, phone, gender, income) {
  return new Promise(async (resolve, reject) => {
    try {
      const hash = await bcrypt.hash(password, rounds)
      db.run("INSERT INTO SiteUser (email, password) VALUES (?, ?)", [email, hash], function(err) {
        if (err) {
          console.log("Error:", err)
          reject(err)
        } else {
          const custID = this.lastID
          db.run("INSERT INTO Customer (userID, name, address, phone, gender, income) VALUES (?, ?, ?, ?, ?, ?)", [custID, name, address, phone, gender, income], (err) => {
            if (err) {
              console.log("Error:", err)
              reject(err)
            } else {
              console.log("Insert Customer: Sucess")
              resolve(custID)
            }
          })
        }
      })
    } catch (err){
      console.log("Error:", err)
      reject(err)
    }
  })
}

async function insertEmployee(name, email, password, dealerID) {
  return new Promise(async (resolve, reject) =>{
    try {
      const hash = await bcrypt.hash(password, rounds)
      db.run("INSERT INTO SiteUser (email, password, role) VALUES (?, ?, ?)", [email, hash, "empl"], function(err) {
        if (err) {
          console.log("Error:", err)
          reject(err)
        } else {
          const emplID = this.lastID
          db.run("INSERT INTO Employee (userID, name, dealerID) VALUES (?, ?, ?)", [emplID, name, dealerID], (err) => {
            if (err) {
              console.log("Error:", err)
              reject(err)
            } else {
              console.log("Insert Employee: Sucess")
              resolve(emplID)
            }
          })
        }
      })
    } catch (err){
      console.log("Error:", err)
      reject(err)
    }
  })
}

async function insertValues() {
  try {
    await new Promise(resolve => setTimeout(resolve, 100)) // Reduced from 5000ms
    
    // Company
    db.run("INSERT INTO Company (companyID, name) VALUES (4321, 'General Motors')")

    // Brands
    db.run("INSERT INTO Brand (brandID, name, companyID) VALUES (10, 'Chevrolet', 4321)")
    db.run("INSERT INTO Brand (brandID, name, companyID) VALUES (11, 'Buick', 4321)")
    db.run("INSERT INTO Brand (brandID, name, companyID) VALUES (12, 'GMC', 4321)")
    db.run("INSERT INTO Brand (brandID, name, companyID) VALUES (13, 'Cadillac', 4321)")

    // Plant
    db.run("INSERT INTO Plant (plantID, name, address, companyID) VALUES (20, 'Arlington Assembly', '2525 E Abram Street, Arlington, TX', 4321)")
    
    // Supplier
    db.run("INSERT INTO Supplier (supplyID, name, address) VALUES (21, 'AutoParts', '123 Industry Dr, Stamford, CT')")
    
    // Provides
    db.run("INSERT INTO Provides (plantID, supplyID) VALUES (20, 21)")

    // Dealerships
    db.run("INSERT INTO Dealership (dealerID, name, address, capacity) VALUES (30, 'H & L Chevrolet', '1416 Post Road, Darien, CT', 20)")
    db.run("INSERT INTO Dealership (dealerID, name, address, capacity) VALUES (31, 'Buick White Plains', '358 Central Ave, White Plains, NY', 30)")
    db.run("INSERT INTO Dealership (dealerID, name, address, capacity) VALUES (32, 'GMC Bedford Hills', '606 Bedford Rd, Bedford Hills, NY', 50)")
    db.run("INSERT INTO Dealership (dealerID, name, address, capacity) VALUES (33, 'Cadillac of Greenwich', '144 Railroad Ave, Greenwich, CT', 20)")

    // Vehicles and Options
    db.run("INSERT INTO Vehicle (VIN, model_name, price, plantID, brandID, dealerID) VALUES (101, '2025 Suburban', 62000, 20, 10, 30)")
    db.run("INSERT INTO Options (VIN, color, engine, transmission) VALUES (101, 'Black Metallic', '5.3L V8', '10-Speed Automatic')")

    db.run("INSERT INTO Vehicle (VIN, model_name, price, plantID, brandID, dealerID) VALUES (102, '2025 Envista Avenir', 28000, 20, 11, 31)")
    db.run("INSERT INTO Options (VIN, color, engine, transmission) VALUES (102, 'Ocean Blue Metallic', 'ECOTEC 1.2 Turbo', '6-Speed Automatic')")

    db.run("INSERT INTO Vehicle (VIN, model_name, price, plantID, brandID, dealerID) VALUES (103, '2025 Canyon', 38400, 20, 12, 32)")
    db.run("INSERT INTO Options (VIN, color, engine, transmission) VALUES (103, 'Summit White', 'TurboMax', '8-Speed Automatic')")

    db.run("INSERT INTO Vehicle (VIN, model_name, price, plantID, brandID, dealerID) VALUES (104, '2025 Escalade', 88100, 20, 13, 33)")
    db.run("INSERT INTO Options (VIN, color, engine, transmission) VALUES (104, 'Black Raven', '6.2L V8', '10-Speed Automatic')")

    // Wait for above inserts to complete
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Users
    await insertCustomer("Alice", "user@email.com", "userpass", "1234 Oak Dr", "203-867-5309", "Male", 30000)
    await insertEmployee("Bob", "empl@bob.com", "emplpass1", 30)
    await insertEmployee("Charlie", "empl@charlie.com", "emplpass2", 31)
    await insertEmployee("Devon", "empl@devon.com", "emplpass3", 32)
    await insertEmployee("Eugene", "empl@eugene.com", "emplpass4", 33)
    
  } catch (error) {
    console.log("Error:", error)
  }
}

// Close the database
async function main() {
  try {
    await insertValues()
  } catch (error) {
    console.log("Error: ", error)
  } finally {
    db.close()
  }
}

main()