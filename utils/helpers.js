import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
const dom = new JSDOM();
const parser = new dom.window.DOMParser(); // Access DOMParser from JSDOM's window
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'logs.txt');

export const decodeGraphQLId = (encodedId) => {
	/**
	 * Decodes a GraphQL ID from a Base64-encoded string.
	 *
	 * @param {string} encodedId - The Base64-encoded ID string.
	 * @returns {string} The decoded string in UTF-8 format.
	 */

	const decodedString = Buffer.from(encodedId, 'base64').toString('utf-8');
	return decodedString.split(':')[1];
};

export const writeLog = (message) => {
	const timestamp = new Date().toISOString();
	const logMessage = `[${timestamp}] ${message}\n`;

	fs.appendFile(logFilePath, logMessage, (err) => {
		if (err) {
			console.error('Error writing to log file:', err);
		} else {
			console.log('Log written successfully.');
		}
	});
};

export const formatToFourDigits = (number) => {
	if (number < 0 || number > 9999) {
		throw new Error('Input must be a number between 0 and 999.');
	}
	return number.toString().padStart(5, '0');
};

function ensureParagraphTags(htmlString) {
	// this is needed for blog 3 to render but 4 doesn't 

	// if removed then nothing is rendered
	if (!htmlString.startsWith('<p>')) {
		htmlString = '<p>' + htmlString;
	}
	if (!htmlString.endsWith('</p>')) {
		htmlString = htmlString + '</p>';
	}
	// Replace `<br>` tags with meaningful `<p>` tags or spaces
	htmlString = htmlString.replace(/<br\s*\/?>(\s*<br\s*\/?>)?/gi, '</p><p>'); // Replace single or double `<br>` with paragraph breaks
	htmlString = htmlString.replace(/\n/g, ' '); // Replace newlines with spaces for inline formatting
	// htmlString = htmlString.replace(/\r/g, ''); // Replace newlines with spaces for inline formatting
	return htmlString;
	// htmlString = htmlString
	// 	.replace(/<br\s*\/?>(<br\s*\/?>)?/gi, '<p></p>') // Replace <br> or <br><br> with <p></p>
	// 	.replace(/\n/g, '<p></p>'); // Replace \n with <p></p>
	return htmlString;
}

const processNode = (node) => {
	// console.log('Processing Node:', node.nodeName, node);
	// Element Node
	if (node.nodeType === 3) {
		// TEXT_NODE
		const cleanText = node.nodeValue.replace(/&nbsp;/g, ' ').trim();
		if (cleanText) {
			return {
				text: cleanText,
				textStyle: 'b1',
			};
		}
		// HTML Node
	} else if (node.nodeType === 1) {
		// ELEMENT_NODE
		const tagHandler = TAGS[node.tagName];
		// console.log('tagHandler', tagHandler);
		if (tagHandler) {
			return tagHandler(node);
		}

		// Handle nested styles (e.g., <b><i>)
		let bold = false;
		let italic = false;
		let currentNode = node;

		while (currentNode) {
			if (currentNode.tagName === 'STRONG' || currentNode.tagName === 'B') {
				bold = true;
			}
			if (currentNode.tagName === 'EM' || currentNode.tagName === 'I') {
				italic = true;
			}
			currentNode = currentNode.parentNode;
		}

		const textContent = node.textContent.trim();
		if (textContent) {
			return {
				text: textContent,
				textStyle: 'b1',
				...(bold && { bold: true }),
				...(italic && { italic: true }),
			};
		}
	}

	// Handle special cases for <li> children
	if (node.tagName === 'LI') {
		const listItemChildren = [];
		node.childNodes.forEach((childNode) => {
			const processedChild = processNode(childNode);
			if (processedChild) {
				listItemChildren.push(processedChild);
			}
		});

		// If <li> contains valid processed children
		if (listItemChildren.length > 0) {
			return {
				type: 'list-item-text',
				children: listItemChildren,
			};
		}
	}

	if (node.nodeName === 'H2') {
		console.log('Processing H2 Node:', node); // Debug log
		const tagHandler = TAGS[node.tagName];
		if (tagHandler) {
			return tagHandler(node);
		}
	}

	return null;
};

const TAGS = {
	EM: (node) => ({
		text: node.textContent.trim(),
		textStyle: 'b1',
		italic: true,
	}),
	STRONG: (node) => ({
		text: node.textContent.trim(),
		textStyle: 'b1',
		bold: true,
	}),
	B: (node) => ({
		text: node.textContent.trim(),
		textStyle: 'b1',
		bold: true,
	}),
	I: (node) => ({
		text: node.textContent.trim(),
		textStyle: 'b1',
		italic: true,
	}),
	SPAN: (node) => ({
		text: node.textContent.trim(),
		textStyle: 'b1',
	}),
	H2: (node) => ({
		textStyle: 'h2',
		text: ` ${node.textContent.trim()} `,
	}),
	A: (node) => ({
		type: 'link',
		url: node.getAttribute('href') || '',
		title: ` ${node.textContent.trim()} `,
		isExternal: node.getAttribute('target') === '_blank',
		thirdParty: node.getAttribute('rel')?.includes('noopener') || false,
		children: [
			{
				textStyle: 'b1',
				text: ` ${node.textContent.trim()} `,
			},
		],
	}),
	UL: (node) => ({
		type: 'unordered-list',
		children: Array.from(node.children).map(processNode),
	}),
	LI: (node) => ({
		type: 'list-item',
		text: node.textContent.trim(),
		textStyle: 'b1',
	}),
};

export const splitParagraphsIntoTextBlocks = (htmlString) => {
	if (typeof htmlString !== 'string') {
		throw new Error('Input must be a string');
	}

	// Ensure paragraphs are properly tagged
	console.log('htmlString', htmlString);
	const ensureParagraphs = ensureParagraphTags(htmlString);
	console.log('ensureParagraphs:', ensureParagraphs);

	const dom = new JSDOM(ensureParagraphs);
	const doc = dom.window.document;

	const textBlocks = [];

	// Process paragraphs
	const elements = doc.querySelectorAll('p, h2, h3, h4, ul, ol, em, i');

	elements.forEach((element) => {
		const children = [];
		const elementText = element.textContent.trim();
		let hasChildNodes = false;

		// Handle unordered and ordered lists
		if (
			element.tagName.toLowerCase() === 'ul' ||
			element.tagName.toLowerCase() === 'ol'
		) {
			element.querySelectorAll('li').forEach((li) => {
				const liText = li.textContent.trim();
				if (liText) {
					children.push({
						type: 'list-item',
						children: [
							{
								textStyle: 'b1', // Assuming `b1` for list items (update as needed)
								text: liText,
							},
						],
					});
				}
			});

			// Push list block only if there are valid list items
			if (children.length > 0) {
				textBlocks.push({
					type:
						element.tagName.toLowerCase() === 'ul'
							? 'bulleted-list'
							: 'numbered-list',
					children,
				});
			}
			return; // Skip further processing for lists
		}

		// Process child nodes for other elements
		element.childNodes.forEach((node) => {
			const child = processNode(node);
			if (child) {
				hasChildNodes = true;
				children.push(child);
			}
		});

		// Add the element's textContent only if there are no child nodes
		if (!hasChildNodes && elementText) {
			children.push({
				textStyle: element.tagName.toLowerCase(), // Use tag name as the style
				text: elementText,
			});
		}

		// Determine block type
		let blockType;
		if (['h2', 'h3', 'h4'].includes(element.tagName.toLowerCase())) {
			blockType = element.tagName.toLowerCase();
		} else if (['em', 'i'].includes(element.tagName.toLowerCase())) {
			blockType = 'emphasis'; // Custom block type for <em> and <i>
		} else {
			blockType = 'paragraph';
		}

		// Push to textBlocks if there is content
		if (children.length > 0) {
			textBlocks.push({
				type: blockType,
				children,
			});
		}
	});

	// // Process ordered lists
	// const orderedLists = doc.querySelectorAll('ol');
	// orderedLists.forEach((ol) => {
	// 	const listItems = Array.from(ol.querySelectorAll('li')).map((li) => {
	// 		const listItemChildren = [];
	// 		li.childNodes.forEach((node) => {
	// 			const child = processNode(node);
	// 			if (child) {
	// 				listItemChildren.push({
	// 					type: 'list-item-text',
	// 					children: [child],
	// 				});
	// 			}
	// 		});
	// 		return {
	// 			type: 'list-item',
	// 			children: listItemChildren,
	// 		};
	// 	});
	// 	textBlocks.push({
	// 		type: 'numbered-list',
	// 		children: listItems,
	// 	});
	// });

	// // Process unordered lists
	// // Process unordered lists
	// const unorderedLists = doc.querySelectorAll('ul');
	// console.log('Found Unordered Lists:', unorderedLists);

	// unorderedLists.forEach((ul) => {
	// 	const listItems = Array.from(ul.querySelectorAll('li')).map((li) => {
	// 		// console.log('Processing List Item:', li);
	// 		const listItemChildren = [];
	// 		li.childNodes.forEach((node) => {
	// 			const child = processNode(node);
	// 			if (child) {
	// 				listItemChildren.push({
	// 					type: 'list-item-text',
	// 					children: [child],
	// 				});
	// 			} else {
	// 				console.log('Skipped Node in <li>:', node);
	// 			}
	// 		});
	// 		return {
	// 			type: 'list-item',
	// 			children: listItemChildren,
	// 		};
	// 	});

	// 	if (listItems.length > 0) {
	// 		textBlocks.push({
	// 			type: 'bulleted-list',
	// 			children: listItems,
	// 		});
	// 	} else {
	// 		console.log('Skipped Empty <ul> or <li>');
	// 	}
	// });

	return textBlocks;
};

// export const splitParagraphsIntoTextBlocks = (htmlString) => {
// 	if (typeof htmlString !== 'string') {
// 		throw new Error('Input must be a string');
// 	}

// 	const ensureParagraphs = ensureParagraphTags(htmlString)

// 	// Create a DOM parser to handle the HTML string
// 	const dom = new JSDOM(ensureParagraphs);
// 	const doc = dom.window.document;

// 	Array.from(doc.childNodes).forEach((node) => {
// 		if (node.nodeType === 3) {
// 			// If it's a TEXT_NODE, split by \n
// 			const segments = node.nodeValue.split('\n');
// 			const parent = node.parentNode;

// 			segments.forEach((segment, index) => {
// 				if (segment.trim()) {
// 					// Add the text node back for non-empty text
// 					parent.insertBefore(doc.createTextNode(segment), node);
// 				} else {
// 					// Add an empty <p> for empty lines
// 					const emptyP = doc.createElement('p');
// 					parent.insertBefore(emptyP, node);
// 				}
// 				// Add a line break if it's not the last segment
// 				if (index < segments.length - 1) {
// 					parent.insertBefore(doc.createElement('br'), node);
// 				}
// 			});

// 			// Remove the original text node
// 			parent.removeChild(node);
// 		}
// 	});

// 	const textBlocks = [];

// 	// Helper function to process text nodes and inline elements
// 	const processNode = (node) => {
// 		if (node.nodeType === 3) {
// 			// TEXT_NODE
// 			const cleanText = node.nodeValue.replace(/&nbsp;/g, ' ').trim();
// 			if (cleanText) {
// 				return {
// 					text: cleanText,
// 					textStyle: 'b1',
// 				};
// 			}
// 		} else if (node.nodeType === 1) {
// 			// ELEMENT_NODE
// 			if (node.tagName === 'STRONG') {
// 				return {
// 					text: node.textContent.trim(),
// 					textStyle: 'b1',
// 					bold: true,
// 				};
// 			} else if (node.tagName === 'EM' || node.tagName === 'I') {
// 				return {
// 					text: node.textContent.trim(),
// 					textStyle: 'b1',
// 					italic: true,
// 				};
// 			} else if (node.tagName === 'A') {
// 				return {
// 					type: 'link',
// 					url: node.getAttribute('href') || '',
// 					title: ` ${node.textContent.trim()} `,
// 					isExternal: node.getAttribute('target') === '_blank',
// 					thirdParty: node.getAttribute('rel')?.includes('noopener') || false,
// 					children: [
// 						{
// 							textStyle: 'b1',
// 							text: ` ${node.textContent.trim()} `,
// 						},
// 					],
// 				};
// 			}
// 		}
// 		return null;
// 	};

// 	// Process paragraphs
// 	const paragraphs = doc.querySelectorAll('p');
// 	paragraphs.forEach((paragraph) => {
// 		const children = [];
// 		paragraph.childNodes.forEach((node) => {
// 			const child = processNode(node);
// 			if (child) {
// 				children.push(child);
// 			}
// 		});
// 		textBlocks.push({
// 			type: 'paragraph',
// 			children,
// 		});
// 	});

// 	// Process ordered lists
// 	const orderedLists = doc.querySelectorAll('ol');
// 	orderedLists.forEach((ol) => {
// 		const listItems = Array.from(ol.querySelectorAll('li')).map((li) => {
// 			const listItemChildren = [];
// 			li.childNodes.forEach((node) => {
// 				const child = processNode(node);
// 				if (child) {
// 					listItemChildren.push({
// 						type: 'list-item-text',
// 						children: [child],
// 					});
// 				}
// 			});
// 			return {
// 				type: 'list-item',
// 				children: listItemChildren,
// 			};
// 		});
// 		textBlocks.push({
// 			type: 'numbered-list',
// 			children: listItems,
// 		});
// 	});

// 	// Process unordered lists
// 	const unorderedLists = doc.querySelectorAll('ul');
// 	unorderedLists.forEach((ul) => {
// 		const listItems = Array.from(ul.querySelectorAll('li')).map((li) => {
// 			const listItemChildren = [];
// 			li.childNodes.forEach((node) => {
// 				const child = processNode(node);
// 				if (child) {
// 					listItemChildren.push({
// 						type: 'list-item-text',
// 						children: [child],
// 					});
// 				}
// 			});
// 			return {
// 				type: 'list-item',
// 				children: listItemChildren,
// 			};
// 		});
// 		textBlocks.push({
// 			type: 'bulleted-list',
// 			children: listItems,
// 		});
// 	});

// 	return textBlocks;
// };

// export const splitParagraphsIntoTextBlocks = (htmlString) => {
// 	if (typeof htmlString !== 'string') {
// 		throw new Error('Input must be a string');
// 	}

// 	// Create a DOM parser to handle the HTML string
// 	const dom = new JSDOM(htmlString);
// 	const doc = dom.window.document;

// 	const textBlocks = [];

// 	// Helper function to process text nodes and inline elements
// 	const processNode = (node) => {
// 		if (node.nodeType === 3) {
// 			// TEXT_NODE
// 			const cleanText = node.nodeValue.replace(/&nbsp;/g, ' ').trim();
// 			if (cleanText) {
// 				return {
// 					text: cleanText,
// 					textStyle: 'b1',
// 				};
// 			}
// 		} else if (node.nodeType === 1) {
// 			// ELEMENT_NODE
// 			if (node.tagName === 'STRONG') {
// 				return {
// 					text: node.textContent.trim(),
// 					textStyle: 'b1',
// 					bold: true,
// 				};
// 			} else if (node.tagName === 'EM') {
// 				return {
// 					text: node.textContent.trim(),
// 					textStyle: 'b1',
// 					italic: true,
// 				};
// 			} else if (node.tagName === 'A') {
// 				return {
// 					type: 'link',
// 					url: node.getAttribute('href') || '',
// 					title: node.textContent.trim(),
// 					isExternal: node.getAttribute('target') === '_blank',
// 					thirdParty: node.getAttribute('rel')?.includes('noopener') || false,
// 					children: [
// 						{
// 							textStyle: 'b1',
// 							text: node.textContent.trim(),
// 						},
// 					],
// 				};
// 			}
// 		}
// 		return null;
// 	};

// 	// Process paragraphs
// 	const paragraphs = doc.querySelectorAll('p');
// 	paragraphs.forEach((paragraph) => {
// 		const children = [];
// 		paragraph.childNodes.forEach((node) => {
// 			const child = processNode(node);
// 			if (child) {
// 				children.push(child);
// 			}
// 		});
// 		textBlocks.push({
// 			type: 'paragraph',
// 			children,
// 		});
// 	});

// 	// Process ordered lists
// 	const orderedLists = doc.querySelectorAll('ol');
// 	orderedLists.forEach((ol) => {
// 		const listItems = Array.from(ol.querySelectorAll('li')).map((li) => {
// 			const listItemChildren = [];
// 			li.childNodes.forEach((node) => {
// 				const child = processNode(node);
// 				if (child) {
// 					listItemChildren.push({
// 						type: 'list-item-text',
// 						children: [child],
// 					});
// 				}
// 			});
// 			return {
// 				type: 'list-item',
// 				children: listItemChildren,
// 			};
// 		});
// 		textBlocks.push({
// 			type: 'numbered-list',
// 			children: listItems,
// 		});
// 	});

// 	// Process unordered lists
// 	const unorderedLists = doc.querySelectorAll('ul');
// 	unorderedLists.forEach((ul) => {
// 		const listItems = Array.from(ul.querySelectorAll('li')).map((li) => {
// 			const listItemChildren = [];
// 			li.childNodes.forEach((node) => {
// 				const child = processNode(node);
// 				if (child) {
// 					listItemChildren.push({
// 						type: 'list-item-text',
// 						children: [child],
// 					});
// 				}
// 			});
// 			return {
// 				type: 'list-item',
// 				children: listItemChildren,
// 			};
// 		});
// 		textBlocks.push({
// 			type: 'bulleted-list',
// 			children: listItems,
// 		});
// 	});

// 	return textBlocks;
// };

// export const splitParagraphsIntoTextBlocks = (htmlString) => {
// 	if (typeof htmlString !== 'string') {
// 		throw new Error('Input must be a string');
// 	}

// 	// Create a DOM parser to handle the HTML string
// 	// const parser = new DOMParser();
// 	const doc = parser.parseFromString(htmlString, 'text/html');

// 	// Get all paragraph elements
// 	const paragraphs = doc.querySelectorAll('p');
// 	// console.log('paragraphs', paragraphs)

// 	const textBlocks = [];

// 	// Helper function to process text nodes and inline elements
// 	const processNode = (node) => {
// 		if (node.nodeType === 3) {
// 			// TEXT_NODE
// 			const cleanText = node.nodeValue.replace(/&nbsp;/g, ' ').trim();
// 			if (cleanText) {
// 				return {
// 					text: cleanText,
// 					textStyle: 'b1',
// 				};
// 			}
// 		} else if (node.nodeType === 1) {
// 			// ELEMENT_NODE
// 			if (node.tagName === 'STRONG') {
// 				return {
// 					text: node.textContent.trim(),
// 					textStyle: 'b1',
// 					bold: true,
// 				};
// 			} else if (node.tagName === 'EM') {
// 				return {
// 					text: node.textContent.trim(),
// 					textStyle: 'b1',
// 					italic: true,
// 				};
// 			} else if (node.tagName === 'A') {
// 				return {
// 					type: 'link',
// 					url: node.getAttribute('href') || '',
// 					title: node.textContent.trim(),
// 					isExternal: node.getAttribute('target') === '_blank',
// 					thirdParty: node.getAttribute('rel')?.includes('noopener') || false,
// 					children: [
// 						{
// 							textStyle: 'b1',
// 							text: node.textContent.trim(),
// 						},
// 					],
// 				};
// 			}
// 		}
// 		return null;
// 	};

// 	// Process paragraphs
// 	const paragraphs = doc.querySelectorAll('p');
// 	paragraphs.forEach((paragraph) => {
// 		const children = [];
// 		paragraph.childNodes.forEach((node) => {
// 			const child = processNode(node);
// 			if (child) {
// 				children.push(child);
// 			}
// 		});
// 		textBlocks.push({
// 			type: 'paragraph',
// 			children,
// 		});
// 	});

// 	// Process ordered lists
// 	const orderedLists = doc.querySelectorAll('ol');
// 	orderedLists.forEach((ol) => {
// 		const listItems = Array.from(ol.querySelectorAll('li')).map((li) => {
// 			const listItemChildren = [];
// 			li.childNodes.forEach((node) => {
// 				const child = processNode(node);
// 				if (child) {
// 					listItemChildren.push({
// 						type: 'list-item-text',
// 						children: [child],
// 					});
// 				}
// 			});
// 			return {
// 				type: 'list-item',
// 				children: listItemChildren,
// 			};
// 		});
// 		textBlocks.push({
// 			type: 'numbered-list',
// 			children: listItems,
// 		});
// 	});

// 	// Process unordered lists
// 	const unorderedLists = doc.querySelectorAll('ul');
// 	unorderedLists.forEach((ul) => {
// 		const listItems = Array.from(ul.querySelectorAll('li')).map((li) => {
// 			const listItemChildren = [];
// 			li.childNodes.forEach((node) => {
// 				const child = processNode(node);
// 				if (child) {
// 					listItemChildren.push({
// 						type: 'list-item-text',
// 						children: [child],
// 					});
// 				}
// 			});
// 			return {
// 				type: 'list-item',
// 				children: listItemChildren,
// 			};
// 		});
// 		textBlocks.push({
// 			type: 'bulleted-list',
// 			children: listItems,
// 		});
// 	});

// 	return textBlocks;
// };

const body_html =
	'"<p><em>The results of a recent study show that One Drop’s AI-powered glucose predictions are 91.9% accurate for hypoglycemia ("low") and 91.6% accurate for hyperglycemia ("high"), demonstrating greater accuracy than other notable providers.</em></p>\n<p><strong>NEW YORK, NY, February 25, 2020 —</strong> One Drop, a leader in digital therapeutics solutions for people living with diabetes and other chronic conditions, presented new results for continuous glucose monitor-based glucose predictions at <a href="https://attd.kenes.com/" target="_blank" rel="noopener noreferrer">The 13th International Conference on Advanced Technologies &amp; Treatments for Diabetes</a> in Madrid, Spain. These findings demonstrate increased accuracy of direct glucose, hypoglycemia, and hyperglycemia predictions across multiple time periods.</p>\n"';

// console.dir(JSON.stringify(splitParagraphsIntoTextBlocks(body_html)), {
// 	maxArrayLength: null,
// });
