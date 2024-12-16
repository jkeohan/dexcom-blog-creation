import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

console.log('client', CLIENT_ID);

export const getAccessToken = async function () {
	try {
		const { data } = await axios.post(
			'https://auth.amplience.net/oauth/token',
			{
				client_id: `${CLIENT_ID}`,
				client_secret: `${CLIENT_SECRET}`,
				grant_type: 'client_credentials',
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);
		return data.access_token;
	} catch (error) {
		console.error('error', error);
	}
};
