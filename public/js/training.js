
$("#send").click(function () {
    const question = $('#question').val();
    const response = $('#response').val();
    if (question === "" || response === "")
        alert("Are you sure ?");
    $('#checkFields').hide();
    var d = new Date();
    const intentName = "training" + d.getTime();
    const newData = {
        "contexts": [],
        "events": [],
        "fallbackIntent": false,
        "name": intentName,
        "priority": 500000,
        "responses": [
            {
                "action": "",
                "affectedContexts": [],
                "defaultResponsePlatforms": {
                    "google": true
                },
                "messages": [
                    {
                        "platform": "google",
                        "textToSpeech": response,
                        "type": "simple_response"
                    },
                    {
                        "speech": response,
                        "type": 0
                    }
                ],
                "parameters": [],
                "resetContexts": false
            }
        ],
        "templates": [question],
        "userSays": [],
        "webhookForSlotFilling": false,
        "webhookUsed": false
    };
    $.ajax({
        url: 'https://api.dialogflow.com/v1/intents?v=20150910',
        type: 'post',
        data: JSON.stringify(newData),
        headers: {
            'Authorization': 'Bearer eafee8d8efc7491fb3d6dfecac94f687',
            'Content-Type': 'application/json'
        },

        success: function (data) {
            alert('Done');
        },
        error: function (data) {
            alert("Failed, please try again.");
        }

    });
});
