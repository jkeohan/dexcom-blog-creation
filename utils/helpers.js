import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { isCancel } from 'axios';
import { text } from 'stream/consumers';
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