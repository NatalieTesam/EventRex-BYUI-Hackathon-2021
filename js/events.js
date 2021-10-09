const events = (function () {
    const db = firebase.firestore();

    function DBGetEvents(cb) {
        ret = [];
        db.collection('events').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ret.push(doc.data());
            });
            cb(ret);
        });
    }

    function PopulateContainer(containerID) {
        let containerEle = document.getElementById(containerID);
        DBGetEvents(function (eventList) {
            for (let i = 0; i < eventList.length; i++) {
                containerEle.appendChild(CreateEventCard(eventList[i].name, eventList[i].imgName, eventList[i].desc));
            }

            if (containerID === 'your_events') {
                let addButton = document.createElement('a');
                addButton.classList.add('card', 'cardBtn');
                // Plus icon
                addButton.innerHTML= '&#10133;';

                containerEle.appendChild(addButton);
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

    function SubmitNewEventForm(form) {
        let formData = {};
        for (let i = 0; i < form.length; i++) {
            if (form[i].type !== 'submit') {
                if (form[i].type === 'radio') {
                    if (form[i].checked) {
                        formData[form[i].name] = form[i].id;
                    }
                } else {
                    formData[form[i].name] = form[i].value;
                }
            }
        }

        db.collection('events').add(formData)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    function CreateEventCard(name, imgName, desc) {
        let card = document.createElement('div');
        card.classList.add('card');

        if (imgName !== undefined) {
            let img = document.createElement('img');
            img.src = 'images/' + imgName;
        }

        let container = document.createElement('div');
        container.classList.add('eventCard');

        let title = document.createElement('h3');
        title.innerText = name;

        let descParagraph = document.createElement('p');
        descParagraph.innerText = desc;

        container.appendChild(title);
        container.appendChild(descParagraph);

        card.appendChild(img);
        card.appendChild(container);

        return card;
    }

    return {
        PopulateContainer: PopulateContainer,
        SubmitNewEventForm: SubmitNewEventForm 
    }
})();