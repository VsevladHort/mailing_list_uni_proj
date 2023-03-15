const documentForm = document.getElementById('document-form');

function sendEmail(data) {
    console.log(data);
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(options)
    return fetch(`/emails/send`, options)
        .then(function (response) {
            if (!response.ok) {
                return response.text().then(function (text) {
                    throw new Error('Error sending email: ' + text);
                });
            }
            return response.json();
        });
}

documentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = {
        to: documentForm.elements["to"].value,
        subject: documentForm.elements["subject"].value,
        text: documentForm.elements["text"].value
    };
    sendEmail(formData)
        .then(function (_) {
            alert('Email sent successfully!');
        })
        .catch(function (error) {
            alert('Error sending email: ' + error.message);
        });
});
