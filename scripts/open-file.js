import { generateSelectorHTML } from "./fileselector.js";
import { getSubjects } from "./todo.js";

let subjects = getSubjects(false)
if (subjects) {
	subjects.forEach(e => {
		e.todoList.forEach(element => {
			element.clickCount = 0;
		})
	})
}






generateSelectorHTML(subjects, false);
