const documentForm = document.getElementById('document-form');
const deleteBtn = document.getElementById('delete-button');
const hiddenInput = document.getElementById('document-id');
// Load a document by ID
function loadDocument(id) {
    return fetch(`/emails/${id}`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Error loading document: ' + response.statusText);
            }
            return response.json();
        });
}
// Save a document
function saveDocument(id, data) {
    console.log(data);
    const options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };
    console.log(options)
    return fetch(`/emails/${id}`, options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Error saving document: ' + response.statusText);
            }
            return response.json();
        });
}
// Delete a document by ID
function deleteDocument(id) {
    const options = {
        method: 'DELETE'
    };
    return fetch(`/emails/${id}`, options)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Error deleting document: ' + response.statusText);
            }
        });
}
// Populate the form with document data
function populateForm(documentData) {
    documentForm.elements["f-name"].value = documentData.f_name;
    documentForm.elements["l-name"].value = documentData.l_name;
    documentForm.elements["p-name"].value = documentData.p_name;
    documentForm.elements["email"].value = documentData.email;
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
        .then(function (savedDocument) {
            alert('Document saved successfully!');
        })
        .catch(function (error) {
            alert('Error saving document: ' + error.message);
        });
});
// Delete the document
deleteBtn.addEventListener('click', function () {
    const documentId = hiddenInput.value;
    deleteDocument(documentId)
        .then(function () {
            alert('Document deleted successfully!');
            documentForm.reset();
        })
        .catch(function (error) {
            alert('Error deleting document: ' + error.message);
        });
});
// Load the document on page load
loadDocument(hiddenInput.value)
    .then(function (documentData) {
        populateForm(documentData);
    })
    .catch(function (error) {
        alert('Error loading document: ' + error.message);
    });