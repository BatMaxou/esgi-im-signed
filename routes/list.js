import { readFile } from "fs/promises";

export const list = async () => {
    const pageTemplate = (await readFile('./templates/page.html')).toString();
    const contentTemplate = (await readFile('./templates/list/content.html')).toString();
    const cardTemplate = (await readFile('./templates/list/card.html')).toString();

    const cards = [];
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
            .replace('{{cards}}', cards.join(' '))
        )
    ;
}
