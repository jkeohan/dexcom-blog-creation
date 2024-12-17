import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFilePath = path.join(__dirname, 'logs.txt');

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
