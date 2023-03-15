const documentForm = document.getElementById('document-form');
const hiddenInput = document.getElementById('document-id');
// Save a document
function saveDocument(id, data) {
    console.log(data);
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(options)
    return fetch(`/emails/create`, options)
        .then(function (response) {
            if (!response.ok) {
                return response.text().then(function (text) {
                    throw new Error('Error saving document: ' + text);
                });
            }
            return response.json();
        });
}
// Submit the document form
documentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const documentId = hiddenInput.value;
    const formData = {
        f_name: documentForm.elements["f-name"].value,
        l_name: documentForm.elements["l-name"].value,
        p_name: documentForm.elements["p-name"].value,
        email: documentForm.elements["email"].value
    };
    saveDocument(documentId, formData)
        .then(function (_) {
            alert('Document created successfully!');
        })
        .catch(function (error) {
            alert('Error creating document: ' + error.message);
        });
});
