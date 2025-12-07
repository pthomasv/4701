const sqlite3 = require('sqlite3').verbose();

// Create or open the database
const db = new sqlite3.Database('./app_database.db');

// Create a table (if it doesn't exist)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Company (companyID int, name varchar(256), primary key (companyID));");
  
  db.run("CREATE TABLE IF NOT EXISTS Brand (brandID int, name varchar(256), companyID int not null, primary key (brandID), foreign key (companyID) references Company);");
  
  db.run("CREATE TABLE IF NOT EXISTS Supplier (supplyID int, name varchar(256), address varchar(256), primary key (supplyID));");
  
  db.run("CREATE TABLE IF NOT EXISTS Plant (plantID int, name varchar(256), address varchar(256), companyID int not null, primary key (plantID), foreign key (companyID) references Company);");
  
  db.run("CREATE TABLE IF NOT EXISTS Customer (custID int, name varchar(256), address varchar(256), phone varchar(256), gender varchar(256), income int, primary key (custID));");
  
  db.run("CREATE TABLE IF NOT EXISTS Dealership (dealerID int, name varchar(256), address varchar(256), primary key (dealerID));");
  
  db.run("CREATE TABLE IF NOT EXISTS Vehicle (VIN int, model_name varchar(256), date_of_manufacture date, plantID int not null, brandID int not null, custID int, dealerID int, primary key (VIN), foreign key (plantID) references Plant, foreign key (brandID) references Brand, foreign key (custID) references Customer, foreign key (dealerID) references Dealership);");
  
  db.run("CREATE TABLE IF NOT EXISTS Options (color varchar(256), engine varchar(256), transmission varchar(256), VIN int, primary key (VIN), foreign key (VIN) references Vehicle);");
  
  db.run("CREATE TABLE IF NOT EXISTS Provides (plantID int not null, supplyID int not null, primary key (plantID, supplyID), foreign key (plantID) references Plant, foreign key (supplyID) references Supplier);");
  
  db.run("CREATE TABLE IF NOT EXISTS Deals (deal date, custID int not null, dealerID int not null, VIN int not null, primary key (custID, dealerID, VIN, deal), foreign key (custID) references Customer, foreign key (dealerID) references Dealership, foreign key (VIN) references Vehicle);");

  // Starter Customer
  const stmt = db.prepare("INSERT INTO Customer VALUES (?, ?, ?, ?, ?, ?)");
  stmt.run(1, 'John Doe', 'john@example.com', '911', 'male', 100);
  stmt.run(2, 'Jane Smith', 'jane@example.com', '112', 'female', 120);
  stmt.run(3, 'Bob Wilson', 'bob@example.com', '211', 'male', 90);
  stmt.finalize();
});

// Close the database
db.close();