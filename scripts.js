function submitRating(rating) {
    fetch('http://localhost:8080/api/feedback/submit_rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: rating, found: null }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Obrigado pelo seu feedback!');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function submitFound(found) {
    fetch('http://localhost:8080/api/feedback/submit_found', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating: null, found: found }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Obrigado pelo seu feedback!');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
