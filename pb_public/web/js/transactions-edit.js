function setDate($form) {
    if (!$form.Date.value) {
        let d = new Date()
        let date = d.getDate().toString().padStart(2, "0")
        let month = (d.getMonth() + 1).toString().padStart(2, "0")
        $form.Date.value = `${d.getFullYear()}-${month}-${date}`
    }
}

setDate(document.getElementById("transaction-form"))

document.addEventListener("hf:request-before", e => {
    e.detail.submitter.innerText = "Submitting..."
})

document.addEventListener("hf:completed", e => {
    let form = e.detail.form
    let button = e.detail.submitter
    if (form.id === "transaction-form") {
        form.reset()
        button.innerText = "Submit"
    } else {
        button.innerText = "Refresh"
    }
    setDate(document.getElementById("transaction-form"))
})