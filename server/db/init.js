const sqlite3 = require('sqlite3').verbose();

// Create or open the database
const db = new sqlite3.Database('./app_database.db');

// Create a table (if it doesn't exist)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Company (companyID int, name varchar(256), primary key (companyID));");
  
  db.run("CREATE TABLE IF NOT EXISTS Brand (brandID int, name varchar(256), companyID int not null, primary key (brandID), foreign key (companyID) references Company);");
  
  db.run("CREATE TABLE IF NOT EXISTS Supplier (supplyID int, name varchar(256), address varchar(256), primary key (supplyID));");
  
  db.run("CREATE TABLE IF NOT EXISTS Plant (plantID int, name varchar(256), address varchar(256), companyID int not null, primary key (plantID), foreign key (companyID) references Company);");
  
  db.run("CREATE TABLE IF NOT EXISTS Provides (plantID int not null, supplyID int not null, primary key (plantID, supplyID), foreign key (plantID) references Plant, foreign key (supplyID) references Supplier);");

  db.run("CREATE TABLE IF NOT EXISTS Vehicle (VIN int, model_name varchar(256), price int, plantID int not null, brandID int not null, dealerID int, primary key (VIN), foreign key (plantID) references Plant, foreign key (brandID) references Brand, foreign key (dealerID) references Dealership);");

  db.run("CREATE TABLE IF NOT EXISTS Options (color varchar(256), engine varchar(256), transmission varchar(256), VIN int, primary key (VIN), foreign key (VIN) references Vehicle);");

  db.run("CREATE TABLE IF NOT EXISTS SiteUser (userID int auto_increment, email varchar(256) unique not null, password varchar(256) not null, role char(4) not null, primary key (userID));");

  db.run("CREATE TABLE IF NOT EXISTS Customer (userID int, name varchar(256), address varchar(256), phone varchar(256), gender varchar(256), income int, primary key (userID), foreign key (userID) references SiteUser);");

  db.run("CREATE TABLE IF NOT EXISTS Employee (userID int, name varchar(256), dealerID int not null, primary key (userID), foreign key (userID) references SiteUser, foreign key (dealerID) references Dealership);");

  db.run("CREATE TABLE IF NOT EXISTS Dealership (dealerID int, name varchar(256), address varchar(256), capacity int, primary key (dealerID));");
  
  db.run("CREATE TABLE IF NOT EXISTS Deals (dealID int auto_increment, date_of_deal date not null, bought_by int not null, sold_by int not null, VIN int not null, price int, primary key(dealID), foreign key (bought_by) references Customer(userID), foreign key (sold_by) references Dealership(dealerID), foreign key (VIN) references Vehicle);");
  // Starter Customer
  // const stmt = db.prepare("INSERT INTO Customer VALUES (?, ?, ?, ?, ?, ?)");
  // stmt.run(1, 'John Doe', 'john@example.com', '911', 'male', 100);
  // stmt.run(2, 'Jane Smith', 'jane@example.com', '112', 'female', 120);
  // stmt.run(3, 'Bob Wilson', 'bob@example.com', '211', 'male', 90);
  // stmt.finalize();
});

// Close the database
db.close();