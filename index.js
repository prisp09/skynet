const zeni = [];
const vasani = [];
const allFruits = new Set();
var flag = true;
fetch(`./data.json`)
	.then((response) => response.json())
	.then((data) => {
		data.forEach((fruit) => {
			if (fruit.supplier === "Zeni Fruits") {
				zeni.push(fruit);
			} else if (fruit.supplier === "Vasani Fresh") {
				vasani.push(fruit);
			}
			allFruits.add(fruit.fruit_name);
		});
		renderFruits(zeni, vasani);
		renderFruits(vasani, zeni);
		renderFilters(allFruits);
	});

function renderFruits(fruits, rival) {
	const supplierFull = fruits[0].supplier;
	const supplier = supplierFull.split(" ")[0].toLowerCase();
	
	populate(fruits);

	highlight(fruits, rival);

	renderSort(supplier);

	renderImage(fruits, supplier);
}

function populate(fruits) {
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
	html += `</table> `;

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

function renderSort(supplier){
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

function changeImage(fruit_name) {
	if (flag) {
		document.getElementById("image-column").innerHTML = `<img
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

	document.getElementById("fruit-preview").onclick = function () {
		window.open(
			`https://www.google.com/search?q=${fruit_name.split(" ").join("+")}`
		);
	};
}

function renderFilters(arr) {
	let html = `<h1>Filters:</h1>`;

	arr.forEach((fruit) => {
		html += `<span class="filter-inputs">
		<label for="${fruit}-filter">${fruit}</label>
		<input type="checkbox" id="${fruit}-filter" name="${fruit}-filter" value="${fruit}" checked/>
		</span>
		`;
	});

	document.getElementById("filters").innerHTML = html;

	applyFilters();
}

function applyFilters() {
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
	let price = 0;
	rival.forEach((fruit) => {
		if (fruit.fruit_name === curr) {
			price = fruit.price;
			return;
		}
	});
	return price;
}