let pageNum = 1;
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

const insertDataIntoTable = (data) => {
    const documents = document.querySelector('#documents');
    documents.innerHTML = '';
    data.forEach(doc => {
        const row = document.createElement('tr');
        const detailBtn = `<a href=/crud/${doc._id}>edit</a>`
        const sendButton = `<a href=/emails/send/${doc.email}>send</a>`
        row.innerHTML = `
              <td>${doc.f_name}</td>
              <td>${doc.l_name}</td>
              <td>${doc.p_name}</td>
              <td>${doc.email}</td>
              <td>${detailBtn}</td>
              <td>${sendButton}</td>
            `;
        documents.appendChild(row);
    });
}

function loadPage() {
    return fetch(`http://localhost:3000/emails.json?page=${pageNum}`).then(res => res.json());
}

loadPage()
    .then(data => {
        console.log("Fetched page");
        insertDataIntoTable(data)
    })
    .catch(err => console.error(err));


nextPageButton.addEventListener('click', async () => {
    pageNum++;
    await loadPage().then(data => insertDataIntoTable(data));
});


prevPageButton.addEventListener('click', async () => {
    if (pageNum > 1) {
        pageNum--;
        await loadPage().then(data => insertDataIntoTable(data));
    }
});

console.log("Ended initial sequential script!")