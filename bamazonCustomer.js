var mysql = require("mysql");

//connect to mysql overall db
var connection = mysql.createConnection({
	host:"localhost", 
	user:"root", 
	password:"root", 
	database:"bamazon_db", 
	port:"8889"
});

//list out items in the DB
connection.connect(function(error){
	if(error){
		console.log(error);
	};
	console.log("Successfully connected");
	aConnection();
	customerQuery();
});

function aConnection () {
	connection.query("SELECT * FROM products", function(error, results){
		if(error){
			console.log(error);
		};
		console.log("------------------------------------------------")
		console.log("Storefront:")
		console.log(results);
		connection.end();
	});
};


function newPurchase() {
	connection.query("UPDATE products SET stock_quantity = " + newStock + "WHERE item_id = " + parseFloat(inquirerResponse.firstItem) + ";", function(error, results){
		if(error){
			console.log(error);
		};
		connection.end();
	});
};

function customerQuery() {
	connection.query("SELECT * FROM products", function(error, results){
		if (error){
			console.log(error);
		};
		//user prompts section
		var inquirer = require ("inquirer");
		inquirer.prompt([
		{
			type:"confirm",
			message:"Welcome! Are you interested in purchasing any item(s)?",
			name:"purchasingQuery",
			default:true
		},
		{
			type:"input",
			message:"Please enter the item ID of the item you are interested in purchasing.",
			name:"firstItem"
		},
		{
			type:"input",
			message:"How many of this item would you like to puchase? (Please enter a whole integer)",
			name:"firstQuantity"
		},
		{
			type:"list",
			message:"Would you like to continue shopping?",
			choices:["Yes, continue shopping","No, exit store"],
			name:"continueShop"
		}
		]).then(function(inquirerResponse) {
			if(inquirerResponse.purchasingQuery === false){
				console.log("Thank you for visiting, please come again");
			};
			//check if they're purchasing an actual item
			if(12 > parseFloat(inquirerResponse.firstItem) > 0){
				//check if there is enough in stock
				var i = parseFloat(inquirerResponse.firstItem);
				if (inquirerResponse.firstQuantity > results[i].stock_quantity) {
					console.log("There are not enough items in stock!");
				};
				if (inquirerResponse.firstQuantity < results[i].stock_quantity) {
					var newStock = results[i].stock_quantity - inquirerResponse.firstQuantity;
					newPurchase();
					console.log("Thank you! You have purchased " + parseFloat(inquirerResponse.firstQuantity) + "unit(s)!");
				};
			};
			//check for additional purchases
			if(inquirerResponse.continueShop === "Yes, continue shopping") {
				customerQuery();
			};
			if(inquirerResponse.continueShop === "No, exit store"){
				console.log("Thank you for visiting, please come again");
			}
			connection.end();
		});
	});
};