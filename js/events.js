const events = (function () {
    const db = firebase.firestore();

    function DBGetEvents(cb) {
        ret = [];
        db.collection('events').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                ret.push(doc);
            });
            cb(ret);
        });
    }

    function PopulateContainer(containerID) {
        let containerEle = document.getElementById(containerID);
        DBGetEvents(function (eventList) {
            for (let i = 0; i < eventList.length; i++) {
                let eventData = eventList[i].data();
                containerEle.appendChild(CreateEventCard(eventData.name, eventData.imgName, eventData.desc, eventList[i].id));
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

    function SubmitEventForm(form) {
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

    function CreateEventCard(name, imgName, desc, eventID) {
        if (name) {
            let card = document.createElement('div');
            card.classList.add('card');

            let container = document.createElement('div');
            container.classList.add('eventCard');

            let link = document.createElement('a');
            link.href = 'editevent.html?id=' + eventID;

            let title = document.createElement('h3');
            title.innerText = name;

            let descParagraph = document.createElement('p');
            descParagraph.innerText = desc;

            if (imgName !== undefined) {
                let img = document.createElement('img');
                img.src = 'images/' + imgName;
                link.appendChild(img);
            }

            container.appendChild(title);
            container.appendChild(descParagraph);

            link.appendChild(container);

            card.appendChild(link);

            return card;
        } else {
            return null;
        }
    }

    return {
        PopulateContainer: PopulateContainer,
        SubmitEventForm: SubmitEventForm 
    }
})();