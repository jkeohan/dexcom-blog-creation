import fs from 'fs';
import { JSDOM } from 'jsdom';
import { writeLog } from './helpers.js';
const filePath = '../data/testing.json'; // Adjust path if needed

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
					// regex for commaOrPeriod
					/^[.,]\s*(.*)/.test(nextSibling.nodeValue);

				// Add space before the anchor tag (if it's not the first element)
				const result = [emptyNode, processedNode];

				// Only add space after the anchor tag if it's not followed by punctuation
				if (!isPunctuation) {
					result.push(emptyNode);
				}

				return result;
			}

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
	H: (node, tagName) => ({
		type: 'paragraph',
		children: [
			{
				text: node.textContent.trim(),
				textStyle: `${tagName}`,
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
	B: (node) => {
		if (node.childNodes) {
			const text = processNode(node.childNodes[0]);
			return {
				...text,
				bold: true,
			};
		} else {
			return {
				text: node.textContent,
				textStyle: 'b1',
				bold: true,
			};
		}
	},
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

	// remove <p>'s that are nested inside <li>'s but keep the text content
	htmlString = htmlString.replace(
		/<li[^>]*>\s*<p>(.*?)<\/p>\s*<\/li>/g,
		'<li>$1</li>'
	);
	htmlString = htmlString.replace(/<\/?span[^>]*>/gi, '');
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
	// console.log(parentBlocks);
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
		// handle empty node
		if (!node.textContent.trim()) {
			return null;
		}

		const tagName = node.tagName.toUpperCase().includes('H') ? 'H' : node.tagName.toUpperCase()

		const tagHandler = TAGS[tagName];
		if (tagHandler) {
			console.log({tagName})
			if(tagName === 'H') {
				return tagHandler(node, node.tagName.toLowerCase());
			} else  {
				return tagHandler(node);
			}
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
