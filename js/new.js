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

openRequest.onsuccess = (dbEvent) => {
    const form = document.getElementById('noteform')

    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const db = dbEvent.target.result

        const title = e.target.title.value
        const note = e.target.note.value

        const date = new Date()
        const dateStr = `${date.getHours()} : ${date.getMinutes()}`

        const noteObj = { title, note, dateStr }

        const transaction = db.transaction('notes', 'readwrite')
        const notes = transaction.objectStore('notes')

        const request = notes.add(noteObj)

        request.onsuccess = alertSuccess
        request.onerror = alertError
        request.oncomplete = () => {
            db.close()
        }
    })
}

openRequest.onerror = alertError
