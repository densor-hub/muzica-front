export  const moveFocus = (Event, Key, ArrayOfElements, NumberOfJumps) => {
    for (var i = 0; i < ArrayOfElements.length; i++) {

        if (Event.key === `${Key}` && Event.currentTarget === ArrayOfElements[i]) {
            ArrayOfElements[i + NumberOfJumps].focus();
        }
    }

}

