async function test() {
    try {
        console.log('Fetching tuitions...');
        const response = await fetch('http://localhost:5000/api/tuitions?search=&classFilter=&locationFilter=&sortBy=newest&page=1&limit=8&status=approved');
        
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response data keys:', Object.keys(data));
        if (data.data) {
            console.log('Data length:', data.data.length);
        } else if (Array.isArray(data)) {
            console.log('Data is an array of length:', data.length);
        }
    } catch (e) {
        console.error('Error fetching API:', e.message);
    }
}

test();
