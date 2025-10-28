[
	document.title,
	document.querySelector("h1").innerText
] = Array(2).fill("Comin' Are the Nein")
function tag(el, text) {
	return `<${el}>`
		+ text
		+ `</${el}>`
}
async function loadCharacters() {
	const response = await fetch('./data/.csv');
	const csvText = await response.text();
	const data = [
		{},
		...Papa.parse(csvText, {
			header: true
		}).data
	];
	const select = document.getElementById('characterSelect');
	const details = document.getElementById('characterDetails');
	data.forEach(character => {
		const option = document.createElement('option');
		option.value = character.moniker
		option.textContent = character.moniker
			? `The ${character.moniker}`
			: "--"
		select.appendChild(option);
	});
	select.addEventListener('change', () => {
		const char = data.find(c => c.moniker === select.value);
		if (char) {
			const content = []
			content.push(
				tag("dt",
					tag("h2", char.name
						? char.name
						: tag("i",
							tag("q",
								`The ${char.moniker}`
							)
						)
					)
				)
			)
			content.push(
				tag("dd",
					tag("h3", char.name
						? tag("i",
							tag("q",
								`The ${char.moniker}`
							)
						)
						: ""
				)
			));
			[
				"sex",
				"species",
				"extra"
			].forEach(d => {
				content.push(char[d] ? [
					tag("dt",
						tag("b",
							d[0].toUpperCase() +
							d.slice(1).toLowerCase() +
							":"
						)
					),
					tag("dd",
						char[d]
					)
				].join("") : null)
			})
			details.innerHTML = tag("dl",
				content
				.filter(Boolean)
				.join("")
			)
		}
	});
}
loadCharacters();