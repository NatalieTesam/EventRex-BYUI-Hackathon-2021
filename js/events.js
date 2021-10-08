const Events = (function () {
    const testEvents = [
        { name: 'test name', imgSrc: 'images/randomimage.jpg', desc: 'lorem ipsum dolor sit amet' },
        { name: 'event name', imgSrc: 'images/randomimage.jpg', desc: 'a great event!' },
        { name: 'party!!', imgSrc: 'images/randomimage.jpg', desc: 'it will knock your socks off!' },
        { name: 'some friends gaming', imgSrc: 'images/mariokart.png', desc: 'anyone up for some mariokart?' },
        { name: 'soda mixer', imgSrc: 'images/randomimage.jpg', desc: 'Come and mix some new Sodas, meet new people, and just have fun!' },
        { name: 'soda mixer', imgSrc: 'images/randomimage.jpg', desc: 'Come and mix s meet new people, and just have fun!' }

    ];

    function PopulateContainer(containerID) {
        let containerEle = document.getElementById(containerID);

        for (let i = 0; i < testEvents.length; i++) {
            containerEle.appendChild(CreateEventCard(testEvents[i].name, testEvents[i].imgSrc, testEvents[i].desc));
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
    }

    function CreateEventCard(name, imgSrc, desc) {
        let card = document.createElement('div');
        card.classList.add('card');

        let img = document.createElement('img');
        img.src = imgSrc;

        let container = document.createElement('div');
        container.classList.add('container');

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
        PopulateContainer: PopulateContainer
    }
})();