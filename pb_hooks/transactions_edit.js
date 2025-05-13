/// <reference path="../pb_data/types.d.ts" />

module.exports = {
    refresh: (userId, userSettingsId) => {
        let postTransactionUrl =
            $app
            .findRecordsByFilter("settings", `user='${userId}' && key='postTransactionUrl'`, void 0, 1)[0]
            ?.get("value") ?? ""
        let response = $http.send({ url: postTransactionUrl, method: "GET" })
        if (response.statusCode === 200) {
            userSettings = response.json

            let transaction
            if (userSettingsId) {
                console.log("userSettingsId", userSettingsId)
                // Update
                transaction = $app.findRecordById("settings", userSettingsId)
            } else {
                // Create
                let collection = $app.findCollectionByNameOrId("settings")
                transaction = new Record(collection)
                transaction.set("user", userId)
            }

            transaction.set("key", "userSettings")
            transaction.set("value", JSON.stringify(userSettings))
            $app.save(transaction)
            return userSettings
        }
        return []
    }
}