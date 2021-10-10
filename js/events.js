const events = (function () {
    const db = firebase.firestore();
    const fakeData = [
        { name: 'eventName', desc: 'event descriptions', category: 'party', date: '2021-10-09' },
        { name: 'eventName2', desc: 'event descriptions', category: 'campus', date: '2021-10-09' },
        { name: 'eventName', desc: 'this is an example of a really way too long description that won\'t fit in the event', category: 'party', date: '2021-10-09' },
        { name: 'partayy!!', desc: 'event descriptions', category: 'party', date: '2021-10-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'service', date: '2021-10-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'party', date: '2022-10-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'gettogether', date: '2021-11-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'games', date: '2021-11-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'outdoors', date: '2021-11-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'gettogether', date: '2021-11-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'sport', date: '2021-11-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'etc', date: '2021-11-09' },
        { name: 'eventName', desc: 'event descriptions', category: 'gettogether', date: '2021-11-09' },
        { name: 'eventName', desc: 'desc', category: 'party', date: '2021-10-15' },
    ];

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
        db.collection('events').doc(id).get().then(querySnapshot => {
            let data = querySnapshot.data();
            data.datetime = data.datetime.toDate();
            cb(data);
        });
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
        formData.datetime = firebase.firestore.Timestamp.fromDate(new Date(formData.date + 'T' + formData.time));
        console.log(formData)
        db.collection('events').doc(id).update(formData)
        .then(docRef => {
            cb();
            if (docRef) {
                console.log('updated doc id ', docRef.id)
            }
        })
        .catch(error => console.log('error updating document', error));
    }

    function SubmitEventForm(form, cb) {
        if (form.reportValidity()) {
            let formData = GetFormEventData(form);
            formData.datetime = firebase.firestore.Timestamp.fromDate(new Date(formData.date + 'T' + formData.time));
            formData.author = sessionStorage.getItem('uid');
            db.collection('events').add(formData)
            .then((docRef) => {
                cb(docRef);
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        }
        else{
            window.alert("Please, fill all the required elements");
        }
    }

    function PopulateContainer(containerID) {
        return
        let containerEle = document.getElementById(containerID);
        DBGetEvents(function (eventList) {
            for (let i = 0; i < eventList.length; i++) {
                let eventData = eventList[i].data();
                containerEle.appendChild(CreateEventCard(eventData.name, eventData.desc, eventData.category, eventData.date, eventList[i].id));
            }

            if (containerID === 'find_events') {
                let findButton = document.createElement('a');
                findButton.href = "search.html";
                findButton.classList.add('card', 'cardBtn');
                // Magnifying glass icon
                findButton.innerHTML = '&#128269;';

                containerEle.appendChild(findButton);
            }
        });
    }

    function CreateEventCard(name, desc, category, datetime, isAuthor, eventID) {
        if (name) {
            let link = document.createElement('a');
            if (isAuthor) {
                link.href = 'editevent.html?id=' + eventID;
            } else {
                link.href = 'viewevent.html?id=' + eventID;
            }

            let card = document.createElement('div');
            card.classList.add('card', category);

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

            if (datetime) {
                let localDate = datetime.getDate();
                let dateLabel = document.createElement('span');
                dateLabel.innerText = localDate.toLocaleDateString('en-us');
                dateLabel.classList.add('eventDate');
                card.appendChild(dateLabel);
            }

            link.appendChild(card);
            return link;
        } else {
            return null;
        }
    }

    function getCategoryEvents(radio){
        let results = document.getElementById("searchResults");
        let resultCards = document.createElement("div");
        resultCards.classList.add("eventGrid");
        let i = 1;

        // Clear the container
        while (results.firstChild) {
            results.removeChild(results.firstChild);
        }

        db.collection("events").where("category", "==", radio.id).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let docData = doc.data();
                resultCards.appendChild(CreateEventCard(docData.name, docData.desc, docData.category, (docData.author === sessionStorage.getItem('uid')), docData.datetime, doc.id));
                if (i == querySnapshot.size) {
                    results.appendChild(resultCards);
                }
                i++;
            });
        });
    }

    function GetMyEvents(containerID) {
        // Get personally created events
        let containerEle = document.getElementById(containerID);
        db.collection("events").where("author", "==", sessionStorage.getItem('uid')).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let docData = doc.data();
                containerEle.appendChild(CreateEventCard(docData.name, docData.desc, docData.category, docData.datetime, true, doc.id));
            });
        })
        .catch(error => console.log('error getting my events:', error));
    }

    function GetNewEvents(containerID) {
        let containerEle = document.getElementById(containerID);
    }

    return {
        PopulateContainer: PopulateContainer,
        SubmitEventForm: SubmitEventForm,
        GetEventData: GetEventData,
        UpdateEvent: UpdateEvent,
        getCategoryEvents: getCategoryEvents,
        GetMyEvents: GetMyEvents,
        GetNewEvents: GetNewEvents
    }


})();