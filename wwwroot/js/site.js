/* Variables */
// ===> SignalR
var signalR_connection = new signalR.HubConnectionBuilder().withUrl("/commandHub").build();
//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

// ===> Edit mode
var bodyActiveZone = null;
var enabledEditMode = 0
var counter = 0

// ===> Speech recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const speechRecognition = new SpeechRecognition();
speechRecognition.interimResults = true;
//speechRecognition.lang = 'ro-RO'; //Language selector
var startRecording = 0



/* Onload method */
window.onload = function VoiceRecognitionSetup() {
    speechRecognitionSetup();
    editModeSetup();
}

// ============================================== SignalR ==============================================
signalR_connection.on("ReceiveMessage", function (user, message) {
    console.log("Message received " + signalR_connection.connectionState);
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + " says " + msg;
    var li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
});

signalR_connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    signalR_connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

function signalR_sendMessageToServer(message) {
    console.log(message);
    var user = document.getElementById("userInput").value;
    signalR_connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
}
// ============================================== End signalR ==============================================

// ============================================== Edit mode ==============================================
function editModeSetup() {
    bodyActiveZone = document.getElementById("activeEditZone");
}

function triggerEditMode() {
    counter = 0;
    enabledEditMode = 1 - enabledEditMode;
    countourChildren(bodyActiveZone, enabledEditMode);
}

function countourChildren(myParent, active) {
    console.log(myParent)
    if (myParent == null)
        return;
    var children = myParent.children;
    for (let i = 0; i < children.length; i++) {
        var current = children[i];
        if (current.tagName == 'DIV' && !current.classList.contains("overlayEditBox")) {
            counter++;
            if (active == 1) {
                current.classList.add("editBoxBorder");
                current.classList.add("countour-" + counter);

                var overlayDiv = document.createElement("div"); //overlaydiv to display the element number
                overlayDiv.innerHTML = counter;
                overlayDiv.classList.add("overlayEditBox");
                current.appendChild(overlayDiv);
            }
            else {
                current.classList.remove("editBoxBorder");
                current.classList.remove("countour-" + counter);

                let remove = current.getElementsByClassName("overlayEditBox");
                for (let j = 0; j < remove.length; j++) {
                    try {
                        current.removeChild(remove[j])
                    }
                    catch (e) {
                        //children from inside divs can be shown at a parent state. Just ignore and delete all children with that class
                    }
                }
            }
        }
        countourChildren(current, active);
    }
}
// ============================================== End edit mode ==============================================

// ============================================== Speech recognition ==============================================

function speechRecognitionSetup() {
    let p = document.createElement('p');
    var words = document.querySelector('.words')
    words.appendChild(p);

    speechRecognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        p.textContent = transcript
        if (e.results[0].isFinal) {
            //Append result to a new paragraph
            p = document.createElement('p');
            words.appendChild(p);

            console.log(transcript);
            //Send result with signalR
            signalR_sendMessageToServer(transcript);

            //Special word action
            if (transcript.includes('stop recording'))
                triggerRecording();
        }

        console.log(transcript);
        speechRecognition.addEventListener('end', checkState);
    });
}

function checkState() {
    if (startRecording == 1)
        speechRecognition.start();
}

function triggerRecording() {
    startRecording = 1 - startRecording;
    if (startRecording == 1) {
        speechRecognition.start();
    }
    else
        speechRecognition.stop();
}

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}

// ============================================== End speech recognition ==============================================

//=================================================== Speech Recognition Languages ======================================================
var allAvailableLanguages = [
    {
        "language": "Afrikaans",
        "countryCodes": [
            {
                "langCode": "af-ZA",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Bahasa Indonesia",
        "countryCodes": [
            {
                "langCode": "id-ID",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Bahasa Melayu",
        "countryCodes": [
            {
                "langCode": "ms-MY",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Català",
        "countryCodes": [
            {
                "langCode": "ca-ES",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Čeština",
        "countryCodes": [
            {
                "langCode": "cs-CZ",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Dansk",
        "countryCodes": [
            {
                "langCode": "da-DK",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Deutsch",
        "countryCodes": [
            {
                "langCode": "de-DE",
                "country": "Default"
            }
        ]
    },
    {
        "language": "English",
        "countryCodes": [
            {
                "langCode": "en-AU",
                "country": "Australia"
            },
            {
                "langCode": "en-CA",
                "country": "Canada"
            },
            {
                "langCode": "en-IN",
                "country": "India"
            },
            {
                "langCode": "en-NZ",
                "country": "New Zealand"
            },
            {
                "langCode": "en-ZA",
                "country": "South Africa"
            },
            {
                "langCode": "en-GB",
                "country": "United Kingdom"
            },
            {
                "langCode": "en-US",
                "country": "United States"
            }
        ]
    },
    {
        "language": "Español",
        "countryCodes": [
            {
                "langCode": "es-AR",
                "country": "Argentina"
            },
            {
                "langCode": "es-BO",
                "country": "Bolivia"
            },
            {
                "langCode": "es-CL",
                "country": "Chile"
            },
            {
                "langCode": "es-CO",
                "country": "Colombia"
            },
            {
                "langCode": "es-CR",
                "country": "Costa Rica"
            },
            {
                "langCode": "es-EC",
                "country": "Ecuador"
            },
            {
                "langCode": "es-SV",
                "country": "El Salvador"
            },
            {
                "langCode": "es-ES",
                "country": "España"
            },
            {
                "langCode": "es-US",
                "country": "Estados Unidos"
            },
            {
                "langCode": "es-GT",
                "country": "Guatemala"
            },
            {
                "langCode": "es-HN",
                "country": "Honduras"
            },
            {
                "langCode": "es-MX",
                "country": "México"
            },
            {
                "langCode": "es-NI",
                "country": "Nicaragua"
            },
            {
                "langCode": "es-PA",
                "country": "Panamá"
            },
            {
                "langCode": "es-PY",
                "country": "Paraguay"
            },
            {
                "langCode": "es-PE",
                "country": "Perú"
            },
            {
                "langCode": "es-PR",
                "country": "Puerto Rico"
            },
            {
                "langCode": "es-DO",
                "country": "República Dominicana"
            },
            {
                "langCode": "es-UY",
                "country": "Uruguay"
            },
            {
                "langCode": "es-VE",
                "country": "Venezuela"
            }
        ]
    },
    {
        "language": "Euskara",
        "countryCodes": [
            {
                "langCode": "eu-ES",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Filipino",
        "countryCodes": [
            {
                "langCode": "fil-PH",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Français",
        "countryCodes": [
            {
                "langCode": "fr-FR",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Galego",
        "countryCodes": [
            {
                "langCode": "gl-ES",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Hrvatski",
        "countryCodes": [
            {
                "langCode": "hr_HR",
                "country": "Default"
            }
        ]
    },
    {
        "language": "IsiZulu",
        "countryCodes": [
            {
                "langCode": "zu-ZA",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Íslenska",
        "countryCodes": [
            {
                "langCode": "is-IS",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Italiano",
        "countryCodes": [
            {
                "langCode": "it-IT",
                "country": "Italia"
            },
            {
                "langCode": "it-CH",
                "country": "Svizzera"
            }
        ]
    },
    {
        "language": "Lietuvių",
        "countryCodes": [
            {
                "langCode": "lt-LT",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Magyar",
        "countryCodes": [
            {
                "langCode": "hu-HU",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Nederlands",
        "countryCodes": [
            {
                "langCode": "nl-NL",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Norsk bokmål",
        "countryCodes": [
            {
                "langCode": "nb-NO",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Polski",
        "countryCodes": [
            {
                "langCode": "pl-PL",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Português",
        "countryCodes": [
            {
                "langCode": "pt-BR",
                "country": "Brasil"
            },
            {
                "langCode": "pt-PT",
                "country": "Portugal"
            }
        ]
    },
    {
        "language": "Română",
        "countryCodes": [
            {
                "langCode": "ro-RO",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Slovenščina",
        "countryCodes": [
            {
                "langCode": "sl-SI",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Slovenčina",
        "countryCodes": [
            {
                "langCode": "sk-SK",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Suomi",
        "countryCodes": [
            {
                "langCode": "fi-FI",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Svenska",
        "countryCodes": [
            {
                "langCode": "sv-SE",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Tiếng Việt",
        "countryCodes": [
            {
                "langCode": "vi-VN",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Türkçe",
        "countryCodes": [
            {
                "langCode": "tr-TR",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Ελληνικά",
        "countryCodes": [
            {
                "langCode": "el-GR",
                "country": "Default"
            }
        ]
    },
    {
        "language": "български",
        "countryCodes": [
            {
                "langCode": "bg-BG",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Pусский",
        "countryCodes": [
            {
                "langCode": "ru-RU",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Српски",
        "countryCodes": [
            {
                "langCode": "sr-RS",
                "country": "Default"
            }
        ]
    },
    {
        "language": "Українська",
        "countryCodes": [
            {
                "langCode": "uk-UA",
                "country": "Default"
            }
        ]
    },
    {
        "language": "한국어",
        "countryCodes": [
            {
                "langCode": "ko-KR",
                "country": "Default"
            }
        ]
    },
    {
        "language": "中文",
        "countryCodes": [
            {
                "langCode": "cmn-Hans-CN",
                "country": "普通话 (中国大陆)"
            },
            {
                "langCode": "cmn-Hans-HK",
                "country": "普通话 (香港)"
            },
            {
                "langCode": "cmn-Hant-TW",
                "country": "中文 (台灣)"
            },
            {
                "langCode": "yue-Hant-HK",
                "country": "粵語 (香港)"
            }
        ]
    },
    {
        "language": "日本語",
        "countryCodes": [
            {
                "langCode": "ja-JP",
                "country": "Default"
            }
        ]
    },
    {
        "language": "हिन्दी",
        "countryCodes": [
            {
                "langCode": "hi-IN",
                "country": "Default"
            }
        ]
    },
    {
        "language": "ภาษาไทย",
        "countryCodes": [
            {
                "langCode": "th-TH",
                "country": "Default"
            }
        ]
    }
];

function getLanguages() {
    allAvailableLanguages.forEach(function (item) {
        if (item.countryCodes.length > 1) {
            var allCountries = "";
            console.log(item.language + " (" + item.countryCodes.length + " country(s)) ");

            item.countryCodes.forEach(function (countryItem) {
                console.log("   " + countryItem.country + " | " + countryItem.langCode);
            });

        } else {
            console.log(item.language + " [" + item.countryCodes[0].langCode + "]");
        }
    });
}
//=============================================== END Speech Recognition Languages ============================================================
