const events = (function () {
    const db = firebase.firestore();

    // Returns firestore document objects
    function DBGetEvents(cb) {
        let ret = [];
        db.collection('events').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ret.push(doc);
            });
            cb(ret);
        });
    }

    function GetEventData(id, cb) {
        db.collection('events').doc(id).get().then(querySnapshot => cb(querySnapshot.data()));
    }

    function GetFormEventData(form) {
        let formData = {};
        for (let i = 0; i < form.length; i++) {
            if (form[i].type !== 'button') {
                if (form[i].type === 'radio') {
                    if (form[i].checked) {
                        formData[form[i].name] = form[i].id;
                    }
                } else {
                    formData[form[i].name] = form[i].value;
                }
            }
        }

        return formData;
    }

    function UpdateEvent(id, form, cb) {
        let formData = GetFormEventData(form);
        db.collection('events').doc(id).update(formData)
        .then(docRef => {
            cb(docRef);
            console.log('updated doc id ', docRef.id)
        })
        .catch(error => console.log('error updating doc id ' + docRef, error));
    }

    function SubmitEventForm(form, cb) {
        let formData = GetFormEventData(form);
        db.collection('events').add(formData)
        .then((docRef) => {
            cb(docRef);
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    function PopulateContainer(containerID) {
        let containerEle = document.getElementById(containerID);
        DBGetEvents(function (eventList) {
            for (let i = 0; i < eventList.length; i++) {
                let eventData = eventList[i].data();
                containerEle.appendChild(CreateEventCard(eventData.name, eventData.desc, eventData.category, 'username', eventList[i].id));
            }

            if (containerID === 'find_events') {
                let findButton = document.createElement('a');
                findButton.classList.add('card', 'cardBtn');
                // Magnifying glass icon
                findButton.innerHTML = '&#128269;';

                containerEle.appendChild(findButton);
            }
        });
    }

    function CreateEventCard(name, desc, category, authorName, eventID) {
        if (name) {
            let link = document.createElement('a');
            link.href = 'editevent.html?id=' + eventID;

            let card = document.createElement('div');
            card.classList.add('card');

            let titleEle = document.createElement('h3');
            titleEle.innerText = name;
            card.appendChild(titleEle);

            if (desc) {
                let descEle = document.createElement('p');
                descEle.innerText = desc.substring(0, 30);
                card.appendChild(descEle);
            }

            if (category) {
                let categoryImg = document.createElement('img');
                let categoryLabel = document.createElement('span');
                categoryImg.src = 'images/Icon' + category.toUpperCase() + '.png';
                categoryImg.classList.add('categoryImg');
                categoryLabel.innerText = category;

                card.appendChild(categoryImg);
                card.appendChild(categoryLabel);
            }

            link.appendChild(card);
            console.log(link)
            return link;
        } else {
            console.log("null")
            return null;
        }
    }

    function getCategoryEvents(radio){
        let result = document.getElementById("searchResults");
        let resultCards = document.createElement("div");
        let i = 1;
        db.collection("events").where("category", "==", radio.id).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                resultCards.appendChild(CreateEventCard(docData.name, docData.desc, docData.category, 'username', doc.id));
                if (i == querySnapshot.size) {
                    result.appendChild(resultCards);
                }
                i++;
            });
        });
    }

    return {
        PopulateContainer: PopulateContainer,
        SubmitEventForm: SubmitEventForm,
        GetEventData: GetEventData,
        UpdateEvent: UpdateEvent,
        getCategoryEvents: getCategoryEvents
    }
})();