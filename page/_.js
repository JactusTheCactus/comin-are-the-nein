[
	document.title,
	document.querySelector("h1").innerText
] = Array(2).fill("Comin' Are the Nein")
function tag(el, text) {
	if (Array.isArray(el) && el.length > 1) {
		return tag(el.slice(1), tag(el[0], text))
	} else if (
		typeof el === "string"
		|| (Array.isArray(el) && el.length === 1)
	) {
		if (Array.isArray(el)) {
			el = el[0]
		}
		return `<${el}>`
			+ text
			+ `</${el}>`
	}
}
async function loadCharacters() {
	const data = [
		{},
		...Papa.parse(
			await (
				await fetch('./data/.csv')
			).text(),
			{
				header: true
			}
		).data
	];
	console.log(data)
	const select = document.getElementById('characterSelect');
	const details = document.getElementById('characterDetails');
	data.forEach(character => {
		const option = document.createElement('option');
		option.value = character.moniker ?? "_"
		option.textContent = character.moniker
			? `The ${character.moniker}`
			: "--"
		select.appendChild(option);
	})
	select.addEventListener('change', () => {
		const char = data.find(c => (c.moniker ?? "_") === select.value);
		if (char) {
			const content = []
			content.push(
				char.moniker
					? tag(["dt"],
						char.name
							? char.name
							: tag(["q"],
								`The ${char.moniker}`
							)
					)
					: tag(["code"],
						"Select a Hero to view details"
					)
			)
			if (char.moniker) {
				content.push(
					tag(["dd"],
						char.name
							? tag(["q"],
								`The ${char.moniker}`
							)
							: ""
					)
				)
			}
			[
				"sex",
				"species",
				"extra"
			].forEach(d => {
				content.push(char[d] ? [
					tag(["dt"],
						d[0].toUpperCase() +
						d.slice(1).toLowerCase() +
						":"
					),
					tag(["dd"],
						char[d]
					)
				].join("") : null)
			})
			details.innerHTML = tag(["dl"],
				content
					.filter(Boolean)
					.join("")
			)
		}
	})
	select.dispatchEvent(new Event("change"))
}
loadCharacters();