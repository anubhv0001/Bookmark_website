const CRUDCRUD_API = "https://crudcrud.com/api/bacb3b41fff449a485718b4aea592af3";

// Event listener to add a bookmark
document.getElementById('addBookmark').addEventListener('click', addBookmark);

// Function to fetch bookmarks from CrudCrud
function fetchBookmarks() {
    console.log('Fetching bookmarks...');
    fetch(CRUDCRUD_API)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Bookmarks fetched:', data);
            const bookmarkList = document.getElementById('bookmarkList');
            bookmarkList.innerHTML = '';
            data.forEach(bookmark => {
                addBookmarkToDOM(bookmark);
            });
        })
        .catch(error => console.error('Error fetching bookmarks:', error));
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
    editButton.appendChild(document.createTextNode('Edit'));
    editButton.addEventListener('click', () => editBookmark(bookmark._id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.appendChild(document.createTextNode('Delete'));
    deleteButton.addEventListener('click', () => deleteBookmark(bookmark._id));

    bookmarkButtons.appendChild(editButton);
    bookmarkButtons.appendChild(deleteButton);
    bookmarkDiv.appendChild(bookmarkButtons);

    document.getElementById('bookmarkList').appendChild(bookmarkDiv);
}

// Function to add a bookmark
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

    console.log('Adding bookmark:', bookmark);

    fetch(CRUDCRUD_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookmark)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Bookmark added:', data);
        addBookmarkToDOM(data);
        document.getElementById('websiteTitle').value = '';
        document.getElementById('websiteURL').value = '';
    })
    .catch(error => console.error('Error adding bookmark:', error));
}

// Function to delete a bookmark
function deleteBookmark(id) {
    console.log('Deleting bookmark with id:', id);
    fetch(`${CRUDCRUD_API}/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        fetchBookmarks();
    })
    .catch(error => console.error('Error deleting bookmark:', error));
}

// Function to edit a bookmark
let editingBookmarkId = null;

function editBookmark(id) {
    console.log('Editing bookmark with id:', id);
    fetch(`${CRUDCRUD_API}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(bookmark => {
            document.getElementById('websiteTitle').value = bookmark.title;
            document.getElementById('websiteURL').value = bookmark.url;
            editingBookmarkId = id; // Store the ID of the bookmark being edited
            document.getElementById('saveBookmark').style.display = 'inline-block'; // Show the save button
            document.getElementById('addBookmark').style.display = 'none'; // Hide the add button
        })
        .catch(error => console.error('Error editing bookmark:', error));
}

document.getElementById('saveBookmark').addEventListener('click', saveEditedBookmark);

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

        console.log('Saving edited bookmark:', updatedBookmark);

        fetch(`${CRUDCRUD_API}/${editingBookmarkId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBookmark)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            console.log('Bookmark updated');
            fetchBookmarks(); // Refresh the list of bookmarks
            document.getElementById('websiteTitle').value = '';
            document.getElementById('websiteURL').value = '';
            editingBookmarkId = null; // Reset the editing state
            document.getElementById('saveBookmark').style.display = 'none'; // Hide the save button
            document.getElementById('addBookmark').style.display = 'inline-block'; // Show the add button
        })
        .catch(error => console.error('Error saving edited bookmark:', error));
    }
}


// Initial fetch of bookmarks
document.addEventListener('DOMContentLoaded', fetchBookmarks);
