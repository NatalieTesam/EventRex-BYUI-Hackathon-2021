const Events = (function () {
    function DBGetEvents(cb) {
        events = [];
        db.collection('events').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                events.push(doc.data());
            });
            cb(events);
        });
    }

    function DBCreateEvent() {
        db.collection().add({
            first: "Alan",
            middle: "Mathison",
            last: "Turing",
            born: 1912
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    function PopulateContainer(containerID) {
        let containerEle = document.getElementById(containerID);
        let events = DBGetEvents(function (events) {
            for (let i = 0; i < events.length; i++) {
                containerEle.appendChild(CreateEventCard(events[i].name, events[i].imgName, events[i].desc));
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

    function CreateEventCard(name, imgName, desc) {
        let card = document.createElement('div');
        card.classList.add('card');

        let img = document.createElement('img');
        img.src = 'images/' + imgName;

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
        CreateEvent: CreateEvent
    }
})();