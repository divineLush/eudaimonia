const openRequest = indexedDB.open('eudaimonia', 1)

const alertSuccess = () => {
    alert('spectacular success')
}

const alertError = () => {
    alert('something disgusting happened')
}

openRequest.onupgradeneeded = (e) => {
    const db = e.target.result

    if(!db.objectStoreNames.contains('notes')) {
		const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true })
        store.createIndex('title', 'title', { unique: false })
    }
}

openRequest.onsuccess = (e) => {
    const db = e.target.result;

    const transaction = db.transaction('notes', 'readonly')
    const notes = transaction.objectStore('notes')

    const request = notes.getAll()
    request.onsuccess = (dbEvent) => {
        const noteItems = dbEvent.target.result

        const listEl = document.getElementById('notes-list')
        noteItems.forEach(({ title, note, dateStr }) => {
            const li = document.createElement('li')
            li.classList.add('mb-3')
            li.classList.add('p-1')
            li.innerHTML = `<div class="flex-block"><h3 class="font-oswald">${title}</h3><span>${dateStr}</span></div><p class="mt-2">${note}</p>`
            listEl.prepend(li)
        })

        const deleteAllEl = document.getElementById('delete-all')
        deleteAllEl.addEventListener('click', (e) => {
            const transaction = db.transaction('notes', 'readwrite')
            const notes = transaction.objectStore('notes')

            const request = notes.clear()
            request.onerror = alertError
            request.onsuccess = () => {
                const listEl = document.getElementById('notes-list')
                listEl.innerHTML = ''
            }
            request.oncomplete = () => {
                db.close()
            }
        })
    }
    request.onerror = alertError
    request.oncomplete = () => {
        db.close()
    }
}

openRequest.onerror = alertError
