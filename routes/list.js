import { readFile } from "fs/promises";

import { getBody } from "../library/body.js";

// allow to search with links (https://imsigned.com/?searchTerm=test)
export const getList = async (rawQuery) => {
	const query = new URLSearchParams(rawQuery);
	const searchTerm = query.get('searchTerm');	

	// handle database call
	
	return await list(searchTerm);
}

export const postList = async (request) => {
	const body = new URLSearchParams(await getBody(request));
	const searchTerm = body.get('searchTerm');

	return `${request.headers.origin}?searchTerm=${searchTerm}`;
}

const list = async (searchTerm = null /* add data from search */ ) => {
	const pageTemplate = (await readFile('./templates/page.html')).toString();
	const contentTemplate = (await readFile('./templates/list/content.html')).toString();
	const cardTemplate = (await readFile('./templates/list/card.html')).toString();

	const cards = [];
	// explore database data
	for (let i = 0; i < 3; i++) {
		cards.push(cardTemplate
			.replace('{{username}}', `Initial ${i}`)
			.replace('{{color}}', '#d473d4')
			.replace('{{registerDate}}', `03/11/2024`)
		)
	}

	return pageTemplate
		.replace('{{title}}', 'JeSuisInscrit.com')
		.replace('{{content}}', contentTemplate
			.replace('{{searchTerm}}', searchTerm || '')
			.replace('{{cards}}', cards.join(' '))
		)
	;
}
