import {generateHTML} from "./todo.js";



let subjects = JSON.parse(localStorage.getItem('subjects')) || []


generateSelectorHTML();
export function generateSelectorHTML() {
	let selectorHTML = '';
	subjects.forEach(subject => {
		const subjectName = subject.name[0].toUpperCase() + subject.name.slice(1);
		selectorHTML += `
		<div class="todo">
		<div class="todo-flex-container">
		<p class="todo-header">${subjectName}</p>
		<div class="todo-line"></div>
		<div class="todo-edit-button" data-name="${subjectName}">
		<img src="./pencil.png" class="pencil-icon">
		</div>
		</div>
		</div>
		`
	})
	document.querySelector('.todo-list').innerHTML = selectorHTML;


	document.querySelectorAll('.todo-edit-button').forEach(element => {
		element.addEventListener("click", () => {
			document.querySelector('.todo-list-container').innerHTML = `
			<h1 class="todo-list-text">Edit text:</h1>
			<button class="delete-button">X</button>
			<p class="edit-header">Header: </p>
			<input class="header-input" type="text" value="${element.dataset.name}" required>
			<div class="empty-space"></div>
			<button class="submit">Save and close</button>
			`;
			
			document.querySelector('.submit').addEventListener("click", () => {
				const name = document.querySelector('.header-input').value;
				
				if (!name) {
					alert('Name shouldnt be left empty');
					return 132322;
				}
				
				if (name.length > 35) {
					alert('The name is too long. (max 35 characters)');
					return 74894;
				}
				
				subjects.forEach(elem => {
					const listName = elem.name[0].toUpperCase() + elem.name.slice(1)
					if (listName === element.dataset.name) {
						elem.name = name;
					}
				})
				localStorage.setItem('subjects', JSON.stringify(subjects));
				document.querySelector('.todo-list-container').innerHTML = `
				<h1 class="todo-list-text">Todo lists</h1>
				<button class="add-new-button">+</button>
				<div class="todo-list"></div>`
				generateSelectorHTML();
			})
			document.querySelector('.delete-button').addEventListener("click", () => {
				let deleteIndex;
				subjects.forEach((e, indexi) => {
					if (element.dataset.name === e.name[0].toUpperCase() + e.name.slice(1)) {
						deleteIndex = indexi;
					}
				})
				subjects.splice(deleteIndex, 1);
				localStorage.setItem('subjects', JSON.stringify(subjects))
				document.querySelector('.todo-list-container').innerHTML = `
				<h1 class="todo-list-text">Todo lists</h1>
				<button class="add-new-button">+</button>
				<div class="todo-list"></div>`
				generateSelectorHTML();
			})
		})
	})

	document.querySelector('.add-new-button').addEventListener("click", () => {
		document.querySelector('.todo-list-container').innerHTML = `
		<h1 class="todo-list-text">Add new:</h1>
		<button class="delete-button">X</button>
		<p class="edit-header">Header: </p>
		<input class="header-input" placeholder="Enter the name" type="text" required>
		<div class="empty-space"></div>
		<button class="submit">Save and close</button>
		`;
		
		document.querySelector('.submit').addEventListener("click", () => {
			const name = document.querySelector('.header-input').value;
			
			if (!name) {
				alert('Name shouldnt be left empty');
				return 132322;
			}


			subjects.push({
				name: name,
				todoList: []
			});
			
			localStorage.setItem('subjects', JSON.stringify(subjects))
			document.querySelector('.todo-list-container').innerHTML = `
			<h1 class="todo-list-text">Todo lists</h1>
			<button class="add-new-button">+</button>
			<div class="todo-list"></div>`
			generateSelectorHTML()
		})
		document.querySelector('.delete-button').addEventListener("click", () => {
			document.querySelector('.todo-list-container').innerHTML = `
			<h1 class="todo-list-text">Todo lists</h1>
			<button class="add-new-button">+</button>
			<div class="todo-list"></div>`
			generateSelectorHTML();
		})
	})


	document.querySelectorAll('.todo').forEach((element, index) => {
		element.addEventListener("click", () => {
			document.querySelector('.todo-list-container').innerHTML = `
			<h1 class="todo-list-text">${subjects[index].name}</h1>
      <button class="add-new-button">+</button>
      <div class="todo-list"></div>
			`
			generateHTML(subjects[index].todoList, index, subjects, subjects[index].name);
		})
	})
}