export function send(status: number, data: object, response?: ResponseInit) {
	return new Response(
		JSON.stringify(data),
		{
			...response,
			status,
			headers: {
				'content-type': 'application/json',
				...response?.headers,
			},
		}
	);
}
