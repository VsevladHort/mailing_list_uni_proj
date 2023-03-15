const documentForm = document.getElementById('document-form');
const defaultMessages = ['I have been trying to reach you about your cars extended warranty',
    'Your subscription is about to expire']
const dropdown = document.getElementById('dropdown');
dropdown.style.display = 'none';

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

documentForm.elements['text'].addEventListener('click', (_) => {
    dropdown.innerHTML = '';
    defaultMessages.forEach(function (text) {
        const linkElement = document.createElement('p');
        linkElement.textContent = text;
        linkElement.classList.add("dropdown_option");
        linkElement.addEventListener('click', function () {
            documentForm.elements["text"].value = text;
            dropdown.innerHTML = '';
        });
        dropdown.appendChild(linkElement);
    });
    dropdown.style.display = 'block';
});

documentForm.elements['text'].addEventListener('input', function (_) {
    dropdown.style.display = 'none';
});

document.addEventListener('click', function (event) {
    if (event.target !== documentForm.elements['text'] && event.target !== dropdown) {
        dropdown.style.display = 'none';
    }
});