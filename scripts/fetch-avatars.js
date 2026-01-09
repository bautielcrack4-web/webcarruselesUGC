const https = require('https');

const API_KEY = 'sk_V2_hgu_kndob7VurFB_b1f1V17DvAzlKCymvzuq6H2WZ7JqRQ6v';

const options = {
    hostname: 'api.heygen.com',
    path: '/v2/avatars',
    method: 'GET',
    headers: {
        'X-Api-Key': API_KEY,
        'accept': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const avatars = json.data.avatars.map(a => ({
                id: a.avatar_id,
                name: a.avatar_name,
                preview: a.preview_image_url
            })).slice(0, 20);
            console.log(JSON.stringify(avatars, null, 2));
        } catch (e) {
            console.error('Failed to parse:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();
