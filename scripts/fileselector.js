import {generateHTML, getSubjects, setSubjects} from "./todo.js";
import {addSidebarOnclick} from "./add-sidebar-onclick.js";

// localStorage.setItem('subjects', JSON.stringify([]))
export let completedTodos = getSubjects(true);
if (completedTodos) {
	completedTodos.forEach(e => {
		e.todoList.forEach(element => {
			element.clickCount = 0;
		})
	})
}

addSidebarOnclick();


export function generateSelectorHTML(subjects, completed) {
	let editClicked = false;
	let selectorHTML = '';
	
	if (completed) {
		document.querySelector('.todo-list-container').innerHTML = `
		<h1 class="todo-list-text" style="margin-bottom: 50px;	">Completed todos</h1>
		<div class="todo-list"></div>
		`
		let completedTodos = getSubjects(true);
		completedTodos.forEach((todo, index) => {
			if (todo.todoList.length === 0) {
				completedTodos.splice(index, 1)
				setSubjects(subjects, true);
			}
		})
		document.querySelector('.go-back-arrow-container').innerHTML = '<img class="go-back-arrow" alt="go-back-arrow" src="images/go-back-2.png">'
		document.querySelector('.go-back-arrow').addEventListener('click', () => {
			let ogSubjects = getSubjects(true);
			generateSelectorHTML(ogSubjects, false);
		})
	} else {
		document.querySelector('.todo-list-container').innerHTML = `
		<h1 class="todo-list-text">Todo lists</h1>
		<button class="add-new-button">+</button>
		<div class="todo-list"></div>`
		
		document.querySelector('.go-back-arrow-container').innerHTML = '';
	}
	if (subjects.length === 0) {
		if (completed) {
			selectorHTML = 'You havent completed any todos';
		} else {
			'No todolists available. Add new.';
		}
	} else {
		subjects.forEach(subject => {
			const subjectName = subject.name[0].toUpperCase() + subject.name.slice(1);
			let editButtonHTML = `<div class="todo-edit-button" data-name="${subjectName}"><img src="./pencil.png" class="pencil-icon"></div>`
			if (completed) {
				editButtonHTML = ''
			}
			selectorHTML += `
			<div class="todo">
			<div class="todo-flex-container">
			<p class="todo-header">${subjectName}</p>
			<div class="todo-line"></div>
			${editButtonHTML}
			</div>
			</div>
			`
		})
	}
	
	document.querySelector('.todo-list').innerHTML = selectorHTML;


	document.querySelector('.header-name').addEventListener("click", () => {
		document.querySelector('.todo-list-container').innerHTML = `
		<h1 class="todo-list-text">Todo lists</h1>
		<button class="add-new-button">+</button>
		<div class="todo-list"></div>
		`
		let ogSubjects = getSubjects(true);
		generateSelectorHTML(ogSubjects, false);
	})


	document.querySelectorAll('.todo-edit-button').forEach(element => {
		element.addEventListener("click", () => {
			editClicked = true;
			
			document.querySelector('.todo-list-container').innerHTML = `
			<h1 class="todo-list-text">Edit text:</h1>
			<button class="delete-button">X</button>
			<p class="edit-header">Header: </p>
			<input class="header-input" type="text" value="${element.dataset.name}" required>
			<div class="empty-space"></div>
			<button class="submit">Save and close</button>
			`;
			document.querySelector('.go-back-arrow-container').innerHTML = '<img class="go-back-arrow" alt="go-back-arrow" src="images/go-back-2.png">'
			document.querySelector('.go-back-arrow').addEventListener('click', () => {
				document.querySelector('.todo-list-container').innerHTML = `
				<h1 class="todo-list-text">Todo lists</h1>
				<button class="add-new-button">+</button>
				<div class="todo-list"></div>
				`
				generateSelectorHTML(subjects, false);
			})
				
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
				setSubjects(subjects, false);
				document.querySelector('.todo-list-container').innerHTML = `
				<h1 class="todo-list-text">Todo lists</h1>
				<button class="add-new-button">+</button>
				<div class="todo-list"></div>
				
				`
				generateSelectorHTML(subjects, false);
			})
			document.querySelector('.delete-button').addEventListener("click", () => {
				let deleteIndex;
				subjects.forEach((e, indexi) => {
					if (element.dataset.name === e.name[0].toUpperCase() + e.name.slice(1)) {
						deleteIndex = indexi;
					}
				})
				subjects.splice(deleteIndex, 1);
				setSubjects(subjects, false);
				document.querySelector('.todo-list-container').innerHTML = `
				<h1 class="todo-list-text">Todo lists</h1>
				<button class="add-new-button">+</button>
				<div class="todo-list"></div>
				`
				generateSelectorHTML(subjects, false);
			})
		})
	})

	if (!completed) {
		document.querySelector('.add-new-button').addEventListener("click", () => {
			addAddNewOnclick(subjects);
		})
	}


	document.querySelectorAll('.todo').forEach((element, index) => {
		element.addEventListener("click", () => {
			if (editClicked) {
				editClicked = false;
			} else {
				if (!completed) {
					document.querySelector('.todo-list-container').innerHTML = `
					<h1 class="todo-list-text">${subjects[index].name}</h1>
					<button class="add-new-button">+</button>
					<div class="todo-list"></div>
					`
				} else {
					document.querySelector('.todo-list-container').innerHTML = `
					<h1 class="todo-list-text">Completed: ${subjects[index].name}</h1>
					<div class="header-spacing"></div>
					<div class="todo-list"></div>
					`
				}
				
				generateHTML(subjects[index].todoList, index, subjects, subjects[index].name, completed, completedTodos);
			}
			
		})
	})

}

function addAddNewOnclick(subjects) {
	document.querySelector('.todo-list-container').innerHTML = `
		<h1 class="todo-list-text">Add new:</h1>
		<button class="delete-button">X</button>
		<p class="edit-header">Header: </p>
		<input class="header-input" placeholder="Enter the name" type="text" required>
		<div class="empty-space"></div>
		<button class="submit">Save and close</button>
		`;
		document.querySelector('.go-back-arrow-container').innerHTML = '<img class="go-back-arrow" alt="go-back-arrow" src="images/go-back-2.png">'
		document.querySelector('.go-back-arrow').addEventListener('click', () => {
			document.querySelector('.todo-list-container').innerHTML = `
			<h1 class="todo-list-text">Todo lists</h1>
			<button class="add-new-button">+</button>
			<div class="todo-list"></div>
			`
			generateSelectorHTML(subjects, false);
		})
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
			
			setSubjects(subjects, false);
			document.querySelector('.todo-list-container').innerHTML = `
			<h1 class="todo-list-text">Todo lists</h1>
			<button class="add-new-button">+</button>
			<div class="todo-list"></div>
			`
			generateSelectorHTML(subjects, false)
		})
		document.querySelector('.delete-button').addEventListener("click", () => {
			document.querySelector('.todo-list-container').innerHTML = `
			<h1 class="todo-list-text">Todo lists</h1>
			<button class="add-new-button">+</button>
			<div class="todo-list"></div>
			`
			generateSelectorHTML(subjects, false);
		})
}
