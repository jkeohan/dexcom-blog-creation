import axios from 'axios';

export const getAccessToken = async function () {
	try {
		const { data } = await axios.post(
			'https://auth.amplience.net/oauth/token',
			{
				client_id: '060ded7d-7529-4754-af8a-de8d0bade174',
				client_secret:'59a4c240b4baec91622737d32961d453cf97c51166309617e8fec71309195ac5',
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
