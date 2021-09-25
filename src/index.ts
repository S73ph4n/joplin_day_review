import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function() {
		joplin.commands.register({
			name: 'dayReview',
			label: 'Makes a review of the note edited today',
			iconName: 'fas fa-clipboard-list',
			execute: async () => {
				const notes = (await joplin.data.get(['notes'], { fields: ['id', 'title', 'created_time', 'updated_time', 'is_todo', 'todo_completed' ] }));
				var createdNotes_titles = [];
				var createdNotes_ids = [];
				var updatedNotes_titles = [];
				var updatedNotes_ids = [];
				var createdTodos_titles = [];
				var createdTodos_ids = [];
				var completedTodos_titles = [];
				var completedTodos_ids = [];
				var date = new Date();
				date.setHours(0, 0, 0);
				//const title = date.toString() + " Review";
				var body = "(Generated automatically)\n\n";

				for (let i in notes.items){
					if (notes.items[i].created_time >= date){
						if (notes.items[i].is_todo){
							createdTodos_titles.push(notes.items[i].title);
							createdTodos_ids.push(notes.items[i].id);
						}
						else{
							createdNotes_titles.push(notes.items[i].title);
							createdNotes_ids.push(notes.items[i].id);
						}
					}
					// "else if" so we don't put the created notes also in the "updated" section
					else if (notes.items[i].updated_time >= date && !notes.items[i].is_todo){
						updatedNotes_titles.push(notes.items[i].title);
						updatedNotes_ids.push(notes.items[i].ids);
					}
					if (notes.items[i].is_todo && notes.items[i].todo_completed >= date){
						completedTodos_titles.push(notes.items[i].title);
						completedTodos_ids.push(notes.items[i].ids);
					}


				}
				
				// TODO : make links
				//
				body += "# Created Notes\n";
				for (let i in createdNotes_ids){
					body += "* [" + createdNotes_titles[i] + "](" + createdNotes_ids[i] + ")\n";
				}

				body += "# Updated Notes\n";
				for (let i in updatedNotes_ids){
					body += "* [" + updatedNotes_titles[i] + "](" + updatedNotes_ids[i] + ")\n";
				}

				body += "# Created Todos\n";
				for (let i in createdTodos_ids){
					body += "* [" + createdTodos_titles[i] + "](" + createdTodos_ids[i] + ")\n";
				}

				body += "# Completed Todos\n";
				for (let i in completedTodos_ids){
					body += "* [" + completedTodos_titles[i] + "](" + completedTodos_ids[i] + ")\n";
				}

				console.info(body);
				date.setHours(12, 0, 0);
				const title = date.toISOString().substring(0, 10) + " Review";
				await joplin.data.post(['notes'], null, { body: body, title: title});

			},
		});
		
		joplin.views.toolbarButtons.create('dayReview','dayReview', ToolbarButtonLocation.EditorToolbar);
	},
});
