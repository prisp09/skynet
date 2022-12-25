fetch(`./data.json`)
	.then((response) => response.json())
	.then((data) => {
		const zeni = [];
		const vasani = [];

		data.forEach((fruit) => {
			if (fruit.supplier === "Zeni Fruits") {
				zeni.push(fruit);
			} else if (fruit.supplier === "Vasani Fresh") {
				vasani.push(fruit);
			}
		});

		renderFruits(zeni, vasani);
		renderFruits(vasani, zeni);
	});

function renderFruits(fruits, rival) {
	const supplier = fruits[0].supplier;
    const splitSupplier = supplier.split(" ")[0].toLowerCase();
	let html = 
    `<h1 id="${splitSupplier}">${supplier}</h1>
	<table>
		<thead>
		<th>Fruit</th>
		<th>Price</th>
		<th>Last Updated</th>
		<th>Inventory Count</th>
		</thead>`;

	fruits.forEach((fruit) => { //if price is higher
		if (
			contains(rival, fruit.fruit_name) &&
			price(rival, fruit.fruit_name) < fruit.price
		) {
			html += 
            `<tr>
				<td>${fruit.fruit_name}</td>
				<td>${fruit.price}</td>
				<td>${fruit.last_updated}</td>
				<td>${fruit.inventory_count}</td>
			</tr>`;
		} else { //if price is lower or fruit is not in rival
			html += `
			<tr>
				<td class="highlight">${fruit.fruit_name}</td>
				<td class="highlight">${fruit.price}</td>
				<td class="highlight">${fruit.last_updated}</td>
				<td class="highlight">${fruit.inventory_count}</td>
			</tr>`;
		}
	});
	html += `</table> `;

	document.getElementById(splitSupplier).innerHTML =
		html;
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
