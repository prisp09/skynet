const zeni = []; // Array of fruits from Zeni Fruits
const vasani = []; // Array of fruits from Vasani Fresh
const allFruits = new Set(); // Set of all fruits
const allFruitsarr = []; // Array of all fruits
var flag = true; // Flag to check if there is a fruit selected for our image preview
fetch(`./data.json`) // Fetching the data from the JSON file
	.then((response) => response.json())
	.then((data) => {
		data.forEach((fruit) => {
			if (fruit.supplier === "Zeni Fruits") {
				zeni.push(fruit);
			} else if (fruit.supplier === "Vasani Fresh") {
				vasani.push(fruit);
			}
			allFruits.add(fruit.fruit_name);
			allFruitsarr.push(fruit);
		});

		renderFruits(zeni, vasani); //rendering the zeni fruits table
		renderFruits(vasani, zeni); //rendering the vasani fruits table

		renderFilters(allFruits); //rendering the filters section
		renderEstimate(); //rendering the estimate section
		renderSingle(allFruitsarr); //rendering the single table
	});

function renderSingle(fruits){
	let html = `
	<table>
		<thead>
		<th>Fruit</th>
		<th>Price</th>
		<th>Last Updated</th>
		<th>Inventory Count</th>
		<th>Supplier</th>
   		</thead>`;

	fruits.forEach((fruit)=>{
		html += `
			<tr>
				<td>${fruit.fruit_name}</td>
				<td>${fruit.price}</td>
				<td>${fruit.last_updated}</td>
				<td>${fruit.inventory_count}</td>
				<td>${fruit.supplier}</td>
			</tr>
		`
	})

	html+= "</table>";

	document.getElementById("allFruits").innerHTML = html;
}

function renderEstimate() {
	let html = "";

	allFruits.forEach((fruit) => {
		html += `
		<option value="${fruit}">${fruit}</option>
		`
	});

	//adding options to the select element
	document.getElementById("fruit-input").innerHTML = html;

	//adding our initial estimate
	document.getElementById("price-output").innerHTML = `
	<div for="total-output" class="output-labels total-output">Total:</div><div id="total-output" class="output-labels calculated-output total-output">${calculateEstimate()[4]}</div><br/>
	<div for="zeni-total" class="output-labels">Zeni:</div><div id="zeni-total" class="output-labels calculated-output">${calculateEstimate()[0]}/${calculateEstimate()[1]} items</div><br/>
	<div for="vasani-total" class="output-labels">Vasani:</div><div id="vasani-total" class="output-labels calculated-output">${calculateEstimate()[2]}/${calculateEstimate()[3]} items</div>
	`;
	
	//adding event listeners to the select and input elements
	document.getElementById("fruit-input").onchange = function () {
		const arr = calculateEstimate();
		if(arr === null){
			return;
		}
		document.getElementById("price-output").innerHTML = `
		<div for="total-output" class="output-labels total-output">Total:</div><div id="total-output" class="output-labels calculated-output total-output">${arr[4]}</div><br/>
		<div for="zeni-total" class="output-labels">Zeni:</div><div id="zeni-total" class="output-labels calculated-output">${arr[0]}/${arr[1]} items</div><br/>
		<div for="vasani-total" class="output-labels">Vasani:</div><div id="vasani-total" class="output-labels calculated-output">${arr[2]}/${arr[3]} items</div>
		`;
	};
	
	document.getElementById("quantity-input").onchange = function () {
		const arr = calculateEstimate();
		if(arr === null){
			return null;
		}
		document.getElementById("price-output").innerHTML = `
		<div for="total-output" class="output-labels total-output">Total:</div><div id="total-output" class="output-labels calculated-output total-output">${arr[4]}</div><br/>
		<div for="zeni-total" class="output-labels">Zeni:</div><div id="zeni-total" class="output-labels calculated-output">${arr[0]}/${arr[1]} items</div><br/>
		<div for="vasani-total" class="output-labels">Vasani:</div><div id="vasani-total" class="output-labels calculated-output">${arr[2]}/${arr[3]} items</div>
		`;
	};
}

function calculateEstimate() {
	const fruit = document.getElementById("fruit-input").value;
	let fruitQuantity = document.getElementById("quantity-input").value;
	const zeniPrice = price(zeni, fruit);
	const vasaniPrice = price(vasani, fruit);
	let zeniQuantity = quantity(zeni, fruit);
	let zeniCount = 0;
	let vasaniQuantity = quantity(vasani, fruit);
	let vasaniCount = 0;
	let zeniTotal = 0;
	let vasaniTotal = 0;
	let total = 0;

	let bool = zeniPrice < vasaniPrice;

	//checking if the quantity requested is greater than the quantity available, if so, we return null
	if (fruitQuantity > zeniQuantity + vasaniQuantity) {
		document.getElementById("price-output").innerHTML = `<div style="color: #f582ae; font-weight: bold;">Not enough fruit!</div>`;
		return null;
	};

	//calculating the total price, while also keeping track of the quantity of each fruit from individual suppliers
	for(let i = 0; i < fruitQuantity; i++){
		if(bool){
			zeniTotal += zeniPrice;
			zeniQuantity--;
			bool = zeniQuantity > 0;
			zeniCount++;
		}
		else{
			vasaniTotal += vasaniPrice;
			vasaniQuantity--;
			bool = !(vasaniQuantity > 0);
			vasaniCount++;
		}
	}
	total = zeniTotal + vasaniTotal;
	zeniTotal = zeniTotal.toFixed(2);
	vasaniTotal = vasaniTotal.toFixed(2);
	total = total.toFixed(2);

	return [zeniTotal, zeniCount, vasaniTotal, vasaniCount, total];

}

function renderFruits(fruits, rival) {
	const supplierFull = fruits[0].supplier;
	const supplier = supplierFull.split(" ")[0].toLowerCase();
	
	populate(fruits); //populating the select element with the fruits from the supplier

	highlight(fruits, rival); //highlighting the fruits that are cheaper than the rival

	addSort(supplier); //rendering the sort buttons

	renderImage(fruits, supplier); //rendering the images of the fruits
}

function populate(fruits) { //making the tables and adding the fruits and sort buttons to the tables
	const supplierFull = fruits[0].supplier;
	const supplier = supplierFull.split(" ")[0].toLowerCase();
	let html = `<h1 id="${supplier}">${supplierFull}</h1>
	<table>
		<thead>
		<th>Fruit<div class="up" id="sortFruitAsc${supplier}"></div><div class="down" id="sortFruitDesc${supplier}"></div></th>
		<th>Price<div class="up" id="sortPriceAsc${supplier}"></div><div class="down" id="sortPriceDesc${supplier}"></div></th>
		<th>Last Updated<div class="up" id="sortLastAsc${supplier}"></div><div class="down" id="sortLastDesc${supplier}"></div></th>
		<th>Inventory Count<div class="up" id="sortCountAsc${supplier}"></div><div class="down" id="sortCountDesc${supplier}"></div></th>
		</thead>`;

	fruits.forEach((fruit) => {
		const fruit_name = fruit.fruit_name.split(" ").join("");

		html += `<tr id="${fruit_name}${supplier}" class="dataRow">
		<td>${fruit.fruit_name}</td>
		<td>${fruit.price}</td>
		<td>${fruit.last_updated}</td>
		<td>${fruit.inventory_count}</td>
		</tr>`;
	});
	html += `<caption>*Blue is cheaper</caption></table> `;

	document.getElementById(supplier).innerHTML = html;
}

function highlight(fruits, rival){
	const supplierFull = fruits[0].supplier;
	const supplier = supplierFull.split(" ")[0].toLowerCase();
	fruits.forEach((fruit) => {
		const fruit_name = fruit.fruit_name.split(" ").join("");
		//if price is lower or fruit is not in rival
		if (
			!(
				contains(rival, fruit.fruit_name) &&
				price(rival, fruit.fruit_name) < fruit.price
			)
		) {
			document
				.getElementById(fruit_name + supplier)
				.classList.add("highlight");
		}
	});
}

function addSort(supplier){ //adding the sort button functionality
	if (supplier === "zeni") {
		document.getElementById("sortFruitAsczeni").onclick = function () {
			sort(zeni, "fruit_name");
			renderFruits(zeni, vasani);
			filterSorted(zeni, "zeni");
		};

		document.getElementById("sortPriceAsczeni").onclick = function () {
			sort(zeni, "price");
			renderFruits(zeni, vasani);
			filterSorted(zeni, "zeni");
		};

		document.getElementById("sortLastAsczeni").onclick = function () {
			sort(zeni, "last_updated");
			renderFruits(zeni, vasani);
			filterSorted(zeni, "zeni");
		};

		document.getElementById("sortCountAsczeni").onclick = function () {
			sort(zeni, "inventory_count");
			renderFruits(zeni, vasani);
			filterSorted(zeni, "zeni");
		};

		document.getElementById("sortFruitDesczeni").onclick = function () {
			sort(zeni, "fruit_name", false);
			renderFruits(zeni, vasani);
			filterSorted(zeni, "zeni");
		};

		document.getElementById("sortPriceDesczeni").onclick = function () {
			sort(zeni, "price", false);
			renderFruits(zeni, vasani);
			filterSorted(zeni, "zeni");
		};

		document.getElementById("sortLastDesczeni").onclick = function () {
			sort(zeni, "last_updated", false);
			renderFruits(zeni, vasani);
			filterSorted(zeni, "zeni");
		};

		document.getElementById("sortCountDesczeni").onclick = function () {
			sort(zeni, "inventory_count", false);
			renderFruits(zeni, vasani);
			filterSorted(zeni, "zeni");
		};
	} else {
		document.getElementById("sortFruitAscvasani").onclick = function () {
			sort(vasani, "fruit_name");
			renderFruits(vasani, zeni);
			filterSorted(vasani, "vasani");
		};

		document.getElementById("sortPriceAscvasani").onclick = function () {
			sort(vasani, "price");
			renderFruits(vasani, zeni);
			filterSorted(vasani, "vasani");
		};

		document.getElementById("sortLastAscvasani").onclick = function () {
			sort(vasani, "last_updated");
			renderFruits(vasani, zeni);
			filterSorted(vasani, "vasani");
		};

		document.getElementById("sortCountAscvasani").onclick = function () {
			sort(vasani, "inventory_count");
			renderFruits(vasani, zeni);
			filterSorted(vasani, "vasani");
		};

		document.getElementById("sortFruitDescvasani").onclick = function () {
			sort(vasani, "fruit_name", false);
			renderFruits(vasani, zeni);
			filterSorted(vasani, "vasani");
		};

		document.getElementById("sortPriceDescvasani").onclick = function () {
			sort(vasani, "price", false);
			renderFruits(vasani, zeni);
			filterSorted(vasani, "vasani");
		};

		document.getElementById("sortLastDescvasani").onclick = function () {
			sort(vasani, "last_updated", false);
			renderFruits(vasani, zeni);
			filterSorted(vasani, "vasani");
		};

		document.getElementById("sortCountDescvasani").onclick = function () {
			sort(vasani, "inventory_count", false);
			renderFruits(vasani, zeni);
			filterSorted(vasani, "vasani");
		};
	}
}

function sort(fruits, param, ascending = true) {
	//sorting the fruits, based on ascending or descending and the parameter provided by the button clicked by the user
	if (ascending) {
		if (param === "price") {
			fruits.sort((a, b) => a.price - b.price);
		} else if (param === "last_updated") {
			fruits.sort(
				(a, b) => new Date(a.last_updated) - new Date(b.last_updated)
			);
		} else if (param === "inventory_count") {
			fruits.sort((a, b) => a.inventory_count - b.inventory_count);
		} else if (param === "fruit_name") {
			fruits.sort((a, b) => a.fruit_name.localeCompare(b.fruit_name));
		}
	} else {
		if (param === "price") {
			fruits.sort((a, b) => b.price - a.price);
		} else if (param === "last_updated") {
			fruits.sort(
				(a, b) => new Date(b.last_updated) - new Date(a.last_updated)
			);
		} else if (param === "inventory_count") {
			fruits.sort((a, b) => b.inventory_count - a.inventory_count);
		} else if (param === "fruit_name") {
			fruits.sort((a, b) => b.fruit_name.localeCompare(a.fruit_name));
		}
	}
}

function renderImage(fruits, supplier){
	//adding onclick event to the cells on the table, to change the image when clicked
		if (supplier === "zeni") {
		fruits.forEach((fruit) => {
			document.getElementById(
				`${fruit.fruit_name.split(" ").join("")}zeni`
			).onclick = function () {
				changeImage(fruit.fruit_name);
			};
		});
	} else {
		fruits.forEach((fruit) => {
			document.getElementById(
				`${fruit.fruit_name.split(" ").join("")}vasani`
			).onclick = function () {
				changeImage(fruit.fruit_name);
			};
		});
	}
}

function changeImage(fruit_name) { //changing the image when one of the cells is clicked
	//images are stored in the images folder and are named the same as the fruit name
	if (flag) {
		document.getElementById("image-column").innerHTML = `<br/><img
		id="fruit-preview"
		class="fruit-preview"
		src="./images/${fruit_name}.jpg"
	/>`;
		flag = false;
	} else {
		document.getElementById(
			"fruit-preview"
		).src = `./images/${fruit_name}.jpg`;
	}
	//adding onclick event to the image, to open a new tab with google search results for the fruit name
	document.getElementById("fruit-preview").onclick = function () {
		window.open(
			`https://www.google.com/search?q=${fruit_name.split(" ").join("+")}`
		);
	};
}

function renderFilters(arr) {
	//rendering the filters based on the allFruits set to avoid duplicates
	let html = `<h1>Filters:</h1>`;

	arr.forEach((fruit) => {
		html += `<label class="filter-inputs">
		<label for="${fruit}-filter" style="font-weight: bold">${fruit}</label>
		<input type="checkbox" id="${fruit}-filter" name="${fruit}-filter" value="${fruit}" checked/>
		</label>
		`;
	});

	document.getElementById("filters").innerHTML = html;

	applyFilters();
}

function applyFilters() {
	//applying the filters based on the checkboxes by adding event listeners to them
	const filters = document.querySelectorAll("input[type=checkbox]");
	filters.forEach((filter) => {
		filter.addEventListener("change", function () {
			const currentFruit = filter.value.split(" ").join("");
			zeni.forEach((fruit) => {
				if (fruit.fruit_name === filter.value) {
					document.getElementById(
						currentFruit + "zeni"
					).style.display = this.checked ? "" : "none";
				}
			});
			vasani.forEach((fruit) => {
				if (fruit.fruit_name === filter.value) {
					document.getElementById(
						currentFruit + "vasani"
					).style.display = this.checked ? "" : "none";
				}
			});
		});
	});
};

function filterSorted(supplier, supplierName){
	//since we rerender the table when sorting, we need to apply the filters again after sorting
	const filters = document.querySelectorAll("input[type=checkbox]");
	filters.forEach((filter) => {
			supplier.forEach((fruit) => {
				if (fruit.fruit_name === filter.value) {
					const currentFruit = fruit.fruit_name.split(" ").join("");
					document.getElementById(
						`${currentFruit}${supplierName}`
					).style.display =
					document.getElementById(fruit.fruit_name+"-filter").checked ? "" : "none";
				}
			});
	});
}

function contains(rival, curr) {
	//function to check if the fruit is in the rival's inventory
	let bool = false;
	rival.forEach((fruit) => {
		if (fruit.fruit_name === curr) {
			bool = true;
			return;
		}
	});
	return bool;
}

function price(rival, curr) {
	//function to get the price of the fruit from the rival's inventory
	let price = 0;
	rival.forEach((fruit) => {
		if (fruit.fruit_name === curr) {
			price = fruit.price;
			return;
		}
	});
	return price;
}

function quantity(rival, curr) {
	//function to get the quantity of the fruit from the rival's inventory
	let quantity = 0;
	rival.forEach((fruit) => {
		if (fruit.fruit_name === curr) {
			quantity = fruit.inventory_count;
			return;
		}
	});
	return quantity;
}