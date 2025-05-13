/// <reference path="../pb_data/types.d.ts" />

routerAdd("get", "/app/transactions/edit/", e => {
    let userId = e.get("userId")

    let result = 
        $app
        .findRecordsByFilter("settings", `user='${userId}' && key='userSettings'`, void 0, 1)[0]
    let userSettingsJson = result?.get("value") ?? "null"

    let userSettings = JSON.parse(userSettingsJson)
    if (!userSettings || e.requestInfo().query.refresh) {
        let { refresh } = require(`${__hooks}/transactions_edit.js`)
        userSettings = refresh(userId, result?.get("id"))
    }

    const html = $template.loadFiles(
        `${__hooks}/pages/layout.html`,
        `${__hooks}/pages/transactions_edit.html`,
    ).render({ userSettings })

    return e.html(200, html)
})

routerAdd("post", "/app/transactions/edit/", e => {
    let body = e.requestInfo().body
    if (body.Category.startsWith("Exp:")) {
        body.Amount = -body.Amount
    }

    let userId = e.get("userId")
    let postTransactionUrl =
        $app
        .findRecordsByFilter("settings", `user='${userId}' && key='postTransactionUrl'`, void 0, 1)[0]
        ?.get("value") ?? ""

    if (!postTransactionUrl) {
        return e.html(200, "Post transaction URL not found")
    }

    var formDataString = 
        Object.entries(body)
        .map(pair => `${pair[0]}=${pair[1]}`)
        .join("&")

    let response = $http.send({
        url: postTransactionUrl,
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: formDataString,
    })

    if (response.statusCode === 200) {
        return e.html(200, `<dialog class="toast" is="x-toaster" open=""><p class="message">Saved!</p></dialog>`) 
    }

    return e.html(500, "Error posting transaction")
})
