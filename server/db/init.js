const sqlite3 = require('sqlite3').verbose();

// Create or open the database
const db = new sqlite3.Database('./app_database.db');

// Create a table (if it doesn't exist)
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS Customer (custID int,name varchar(256),address varchar(256),phone varchar(256),gender varchar(256), income int, primary key (custID) );")
  db.run("CREATE TABLE IF NOT EXISTS Plant);")
  // Add some data
  const stmt = db.prepare("INSERT INTO Customer VALUES (?, ?, ?, ?, ?, ?)");
  stmt.run(1, 'John Doe', 'john@example.com', '911', 'male', 100,);
  stmt.finalize();
});

// Close the database
db.close();