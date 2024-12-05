import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const extractFilename = (url) => {
	const match = url.match(/\/articles\/([^?]+)/);
	return match ? match[1] : 'default.png'; // Fallback to 'default.png' if not found
};

// Don't need this if creating the image from the shopify url
// Download the image
const downloadImage = async (imageUrl) => {
	const filename = extractFilename(imageUrl);
	const filePath = path.resolve(__dirname, filename);

	try {
		const response = await axios({
			url: imageUrl,
			method: 'GET',
			responseType: 'stream', // Ensure the response is a stream
		});

		const writer = fs.createWriteStream(filePath);
		response.data.pipe(writer);

		writer.on('finish', () => {
			console.log('Image downloaded successfully as:', filename);
		});

		writer.on('error', (err) => {
			console.error('Error writing the file:', err.message);
		});
	} catch (err) {
		console.error('Error downloading the image:', err.message);
	}
};