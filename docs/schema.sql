create table Company (
  companyID   int,
  name        varchar(256),

  primary key (companyID)
);

create table Brand(
  brandID     int,
  name        varchar(256),
  companyID   int not null,

  primary key (brandID),
  foreign key (companyID) references Company
);

create table Supplier (
  supplyID    int,
  name        varchar(256),
  address     varchar(256),

  primary key (supplyID)
);

create table Plant(
  plantID     int,
  name        varchar(256),
  address     varchar(256),
  companyID   int not null,

  primary key (plantID),
  foreign key (companyID) references Company
);

create table Provides (
	plantID			int not null,
	supplyID 		int not null,

	primary key (plantID, supplyID),
	foreign key (plantID) references Plant,
	foreign key (supplyID) references Supplier
);

create table Vehicle (
	VIN					int,
	model_name	varchar(256),
	price				int,
	plantID			int not null,
	brandID			int not null,
	dealerID		int,

	primary key (VIN),
	foreign key (plantID) references Plant,
	foreign key (brandID) references Brand,
	foreign key (dealerID) references Dealership
);

create table Options (
	color					varchar(256),
	engine				varchar(256),
	transmission	varchar(256),
	VIN 					int,
	
	primary key (VIN),
	foreign key (VIN) references Vehicle
);

create table SiteUser (
	userID				int auto_increment,
	email					varchar(256) unique not null,
	password 			varchar(256) not null
	role 					char(4) not null,
	
	primary key (userID),
);

create table Customer (
	userID				int,
	name					varchar(256),
	address				varchar(256),
	phone					varchar(256),
	gender				varchar(256),
	income				int,

	primary key (userID),
	foreign key (userID) references SiteUser
);

create table Employee (
	userID				int,
	name					varchar(256),
	dealerID			int,

	primary key (userID),
	foreign key (userID) references SiteUser,
	foreign key (dealerID) references Dealership
);

create table Dealership (
	dealerID			int,
	name					varchar(256),
	address				varchar(256),
	capacity			int,

	primary key (dealerID)
);

create table Deals (
	dealID				int auto_increment,
	date_of_deal	date not null,
	bought_by			int not null,
	sold_by				int not null,
	VIN						int not null,
	price					int,

	primary key (dealID),
	foreign key (bought_by) references Customer(userID),
	foreign key (sold_by) references Dealership(dealerID),
	foreign key (VIN) references Vehicle
);
