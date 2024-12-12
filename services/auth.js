import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET } from '../data/constants';

export const getAccessToken = async function () {
	try {
		const { data } = await axios.post(
			'https://auth.amplience.net/oauth/token',
			{
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				grant_type: 'client_credentials',
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

        // console.log('token', data.access_token);
		return data.access_token;

	} catch (error) {
		console.error("error", error);
	}
};
