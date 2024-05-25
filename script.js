const CRUDCRUD_API="https://crudcrud.com/api/c15626cde3ca473396b9ce5491f008ce/bookmark";

// Event listener to add a bookmark
document.getElementById('addBookmark').addEventListener('click', addBookmark);

// Event listener to save edited bookmark
document.getElementById('saveBookmark').addEventListener('click', saveEditedBookmark);

// Function to fetch bookmarks from CRUD CRUD
function fetchBookmarks() {
    fetch(CRUDCRUD_API)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const bookmarkList = document.getElementById('bookmarkList');
            bookmarkList.innerHTML = '';
            data.forEach(bookmark => {
                addBookmarkToDOM(bookmark);
            });
        })
        .catch(error => console.error('Error fetching bookmarks:', error));
}

// Function to add bookmark to the DOM
function addBookmark() {
    const title = document.getElementById('websiteTitle').value;
    const url = document.getElementById('websiteURL').value;

    if (!title || !url) {
        alert('Please fill in both fields');
        return;
    }

    const bookmark = {
        title,
        url
    };

    fetch(CRUDCRUD_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookmark)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        addBookmarkToDOM(data);
        document.getElementById('websiteTitle').value = '';
        document.getElementById('websiteURL').value = '';
    })
    .catch(error => console.error('Error adding bookmark:', error));
}

// Function to delete a bookmark
function deleteBookmark(id) {
    fetch(`${CRUDCRUD_API}/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchBookmarks())
    .catch(error => console.error('Error deleting bookmark:', error));
}

// Function to edit a bookmark
let editingBookmarkId = null;

function editBookmark(id) {
    fetch(`${CRUDCRUD_API}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(bookmark => {
            document.getElementById('websiteTitle').value = bookmark.title;
            document.getElementById('websiteURL').value = bookmark.url;
            editingBookmarkId = id;
            document.getElementById('saveBookmark').style.display = 'inline-block';
            document.getElementById('addBookmark').style.display = 'none';
        })
        .catch(error => console.error('Error editing bookmark:', error));
}

// Function to save edited bookmark
function saveEditedBookmark() {
    if (editingBookmarkId) {
        const title = document.getElementById('websiteTitle').value;
        const url = document.getElementById('websiteURL').value;

        if (!title || !url) {
            alert('Please fill in both fields');
            return;
        }

        const updatedBookmark = {
            title,
            url
        };

        fetch(`${CRUDCRUD_API}/${editingBookmarkId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBookmark)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            fetchBookmarks();
            document.getElementById('websiteTitle').value = '';
            document.getElementById('websiteURL').value = '';
            editingBookmarkId = null;
            document.getElementById('saveBookmark').style.display = 'none';
            document.getElementById('addBookmark').style.display = 'inline-block';
        })
        .catch(error => console.error('Error saving edited bookmark:', error));
    }
}

// Function to add bookmark to the DOM
function addBookmarkToDOM(bookmark) {
    const bookmarkDiv = document.createElement('div');
    bookmarkDiv.className = 'bookmark';

    const bookmarkDetails = document.createElement('div');
    bookmarkDetails.className = 'bookmark-details';
    bookmarkDetails.innerHTML = `<strong>${bookmark.title}</strong> - <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>`;
    bookmarkDiv.appendChild(bookmarkDetails);

    const bookmarkButtons = document.createElement('div');
    bookmarkButtons.className = 'bookmark-buttons';

    const editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editBookmark(bookmark._id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteBookmark(bookmark._id));

    bookmarkButtons.appendChild(editButton);
    bookmarkButtons.appendChild(deleteButton);
    bookmarkDiv.appendChild(bookmarkButtons);

    document.getElementById('bookmarkList').appendChild(bookmarkDiv);
}

// Initial fetch of bookmarks
document.addEventListener('DOMContentLoaded', fetchBookmarks);
