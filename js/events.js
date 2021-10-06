const events = (function () {
    function createEvent(name) {
        console.log('creating event with name ' + name);
    }

    return {
        createEvent: createEvent
    }
})();