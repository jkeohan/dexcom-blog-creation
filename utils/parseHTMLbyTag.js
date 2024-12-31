import fs from 'fs';
import { JSDOM } from 'jsdom';
// const filePath = '../data/all_blog_posts.json'; // Adjust path if needed
const filePath = '../data/testing.json'; // Adjust path if needed
// const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8')).slice(7,8)

// console.log('jsonData', jsonData);
const regexCommaOrPeriod = /^[.,]\s*(.*)/
const processChildrenWithSpaces = (node) => {
	const emptyNode = {
		text: ' ',
		textStyle: 'b1',
	};

	return Array.from(node.childNodes)
		.map((childNode, index, array) => {
			const processedNode = processNode(childNode);

			// Ensure anchor tags are handled consistently
			if (processedNode && processedNode.type === 'link') {
				// Check if the next sibling is a comma, period, or other punctuation
				const nextSibling = array[index + 1];
				const isPunctuation =
					nextSibling &&
					nextSibling.nodeType === 3 &&
					/^[.,]\s*(.*)/.test(nextSibling.nodeValue);

				// Add space before the anchor tag (if it's not the first element)
				const result = [emptyNode, processedNode];

				// Only add space after the anchor tag if it's not followed by punctuation
				if (!isPunctuation) {
					result.push(emptyNode);
				}

				return result;
			}

			// Add space around elements containing anchor tags (such as <p>, <ul>, etc.)
			// if (processedNode && processedNode.children) {
			// 	processedNode.children = processedNode.children
			// 		.map((child) =>
			// 			child.type === 'link' ? [emptyNode, child, emptyNode] : child
			// 		)
			// 		.flat();
			// }

			return processedNode; // Return the node as-is
		})
		.flat() // Flatten the array to avoid nested arrays
		.filter(Boolean); // Remove any null/undefined values
};


const TAGS = {
	P: (node) => ({
		type: 'paragraph',
		children: processChildrenWithSpaces(node),
	}),
	H2: (node) => ({
		type: 'paragraph',
		children: [
			{
				text: node.textContent.trim(),
				textStyle: 'h2',
			},
		],
	}),
	H3: (node) => ({
		type: 'paragraph',
		children: [
			{
				text: node.textContent.trim(),
				textStyle: 'h3',
			},
		],
	}),
	EM: (node) => ({
		text: node.textContent,
		textStyle: 'b1',
		italic: true,
	}),
	STRONG: (node) => ({
		text: node.textContent,
		textStyle: 'b1',
		bold: true,
	}),
	B: (node) => ({
		text: node.textContent,
		textStyle: 'b1',
		bold: true,
	}),
	A: (node) => {
		const link = {
			type: 'link',
			url: node.href,
			title: node.title,
			isExternal: node.target === '_blank', // assuming target="_blank" means external
			thirdParty: true,
			children: [
				{
					textStyle: 'b1',
					text: node.textContent.trim(),
				},
			],
		};
		return link;
	},
	UL: (node) => ({
		type: 'bulleted-list',
		children: [
			...Array.from(node.childNodes).map(processNode).filter(Boolean), // Process the rest of the content
		],
	}),
	OL: (node) => ({
		type: 'numbered-list',
		children: [
			...Array.from(node.childNodes).map(processNode).filter(Boolean), // Process the rest of the content
		],
	}),
	LI: (node) => ({
		type: 'list-item',
		children: [
			{
				type: 'list-item-text',
				children: [
					...Array.from(node.childNodes).map(processNode).filter(Boolean), // Process the rest of the content
				],
			},
		],
	}),
	BR: () => {
		console.log('BR');
		return {
			type: 'paragraph',
			children: [{ text: ' ', textStyle: 'b1' }],
		};
	},
	I: (node) => ({
		text: node.textContent,
		textStyle: 'b1',
		italic: true,
	}),
	BLOCKQUOTE: (node) => ({
		type: 'paragraph',
		children: [
			...Array.from(node.childNodes).map(processNode).filter(Boolean), // Process the rest of the content
		],
	}),
};

function ensureParagraphTags(htmlString) {
	if (!htmlString.startsWith('<p>')) {
		htmlString = '<p>' + htmlString;
	}
	if (!htmlString.endsWith('</p>')) {
		htmlString = htmlString + '</p>';
	}
	// htmlString = htmlString.replace(/\r\n\r\n\u00A0\r\n\r\n/g, '\r\n\r\n');
	// This regex specifically targets newline characters (\n) that occur before a <p> tag or after a </p> tag.
	// It uses lookahead assertions to match newlines in certain contexts.
	// htmlString = htmlString.replace(/(\n)(?=<p>)|(\n)(?=<\/p>)/g, '');
	// Removes all newline characters (\n) from the string.
	htmlString = htmlString.replace(/\n/g, '');
	// htmlString = htmlString
	// 	.replace(/(<br\s*\/?>)+/gi, (match) => {
	// 		// If we have exactly one <br> or multiple <br> tags in a single match
	// 		if (match.includes('<br><br>')) {
	// 			return '\n\n'; // Replace with two new lines for <br><br>
	// 		} else {
	// 			return '\n'; // Replace with one new line for a single <br>
	// 		}
	// 	})
	// 	.trim();

	// Replace the <p> tags nested withing <li> but keep their content
	htmlString = htmlString.replace(
		/<li[^>]*>\s*<p>(.*?)<\/p>\s*<\/li>/g,
		'<li>$1</li>'
	);
	htmlString = htmlString.replace(/<b><b>/g, '')
	// htmlString = htmlString.replace(/<b>/g, '').replace(/<\/b>/g, '');
	htmlString = htmlString.replace(/<\/?span[^>]*>/gi, '');
	console.log('htmlString', htmlString)

	// console.log('htmlString', htmlString);
	return `${htmlString}`;
}

const parseHTMLToParentBlocks = (htmlString) => {
	const dom = new JSDOM(htmlString);
	const doc = dom.window.document;

	return Array.from(doc.body.childNodes);
};

export const convertHTMLToTextBlocks = (htmlString) => {
	const newHtmlString = ensureParagraphTags(htmlString);

	const parentBlocks = parseHTMLToParentBlocks(newHtmlString);
	// console.log('newHtmlString', newHtmlString);
	const textBlocks = [];

	parentBlocks.forEach((block) => {
		const processedBlock = processNode(block);
		if (processedBlock) {
			textBlocks.push(processedBlock);
		}
	});

	return textBlocks;
};

const processNode = (node) => {
	if (node.nodeType === 3) {
		// TEXT_NODE
		const cleanText = node.nodeValue.replace(/&nbsp;/g, ' ').trim();
		if (cleanText) {
			return {
				text: cleanText,
				textStyle: 'b1',
			};
		}
	} else if (node.nodeType === 1) {
		// ELEMENT_NODE
		const tagName = node.tagName.toUpperCase();
		const tagHandler = TAGS[tagName];

		if (tagHandler) {
			return tagHandler(node);
		}

		// Handle <b> nested within other elements
		if (tagName === 'B') {
			return processNode(node.firstChild); // If <b> is empty, process its child
		}
		// Handle children recursively if no specific TAGS handler is found
		const children = Array.from(node.childNodes)
			.map(processNode)
			.filter(Boolean);

		if (children.length > 0) {
			return {
				type: tagName.toLowerCase(),
				children,
			};
		}
	}

	return null;
};

// console.dir(convertHTMLToTextBlocks(jsonData[0].body_html), {depth: null})
