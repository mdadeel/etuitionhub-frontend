const axios = require('axios');

async function test() {
    try {
        console.log('Fetching tuitions...');
        const response = await axios.get('http://localhost:5000/api/tuitions', {
            params: {
                search: '',
                classFilter: '',
                locationFilter: '',
                sortBy: 'newest',
                page: 1,
                limit: 8,
                status: 'approved'
            }
        });
        
        console.log('Status:', response.status);
        console.log('Response data keys:', Object.keys(response.data));
        if (response.data.data) {
            console.log('Data length:', response.data.data.length);
        } else if (Array.isArray(response.data)) {
            console.log('Data is an array of length:', response.data.length);
        }
    } catch (e) {
        console.error('Error fetching API:', e.message);
        if (e.response) {
            console.error('Response body:', e.response.data);
        }
    }
}

test();
