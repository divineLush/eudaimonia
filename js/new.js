const openRequest = indexedDB.open("eudaimonia", 1)

const alertError = () => {
    alert("something disgusting happened")
}

openRequest.onsuccess = () => {
    const db = openRequest.result;
    const form = document.getElementById("noteform")

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        const title = e.target.title.value
        const note = e.target.note.value

        const date = new Date()
        const dateStr = `${date.getHours()} : ${date.getMinutes()}`

        const noteObj = { title, note, dateStr }

        const transaction = db.transaction("notes", "readwrite")
        const notes = transaction.objectStore("notes")

        const request = notes.add(noteObj)

        request.onsuccess = () => {
            alert("spectacular success")
        }

        request.onerror = alertError

        console.log(db)
    })
}

openRequest.onerror = alertError
