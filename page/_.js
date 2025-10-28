[
	document.title,
	document.querySelector("h1").innerText
] = Array(2).fill("Comin' Are the Nein")
function capitalize(text = "", strict = false) {
	return text[0].toUpperCase()
		+ (strict
			? text.slice(1).toLowerCase()
			: text.slice(1)
		)
}
function tag(
	el = ["div"],
	text = "",
	cl = [],
	id = ""
) {
	if (Array.isArray(el) && el.length > 1) {
		return tag(el.slice(1), tag(el[0], text))
	} else if (
		typeof el === "string"
		|| (Array.isArray(el) && el.length === 1)
	) {
		if (Array.isArray(el)) {
			el = el[0]
		}
		return [
			"<" + el,
			id ?
				" id=\"" + id + "\""
				: "",
			cl.length
				? " class=\"" + cl.join(" ") + "\""
				: "",
			">",
			text,
			"</" + el + ">"
		].join("")
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
		const char = data.find(c =>
			(c.moniker ?? "_")
			=== select.value
		);
		if (char) {
			const content = []
			content.push(
				tag(["dt"],
					(char.name
						? char.name
						: tag(["q"],
							`The ${char.moniker}`
						)
					),
					[],
					"primary"
				)
			)
			if (char.moniker) {
				content.push(
					tag(["dd"],
						(char.name
							? tag(["q"],
								`The ${char.moniker}`
							)
							: ""
						),
						[],
						"secondary"
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
						capitalize(d, true) + ":",
						["head"],
						d
					),
					tag(["dd"],
						{
							sex: {
								F: "Female",
								M: "Male"
							}[char[d]] ?? "Neutral",
							species: char[d]
								.split(/ \| /)
								.join("<br>"),
							extra: char[d]
								.split(/, /)
								.join("<br>")
						}[d] ?? char[d],
						["value"],
						d
					)
				].join("") : null)
			})
			details.innerHTML = tag(["dl"],
				content
					.filter(Boolean)
					.join("")
			)
			if (!char.moniker) {
				details.innerHTML = tag(["code"],
					"Select a Hero to view details."
				)
			}
		}
	})
	select.dispatchEvent(new Event("change"))
}
loadCharacters();