import { flushSync } from "react-dom";


const setRequiredFieldsColorRed = (requiredFields, requiredFieldValues) => {
    flushSync(() => {
        for (var i = 0; i < requiredFields.length; i++) {
            if (!requiredFieldValues[i]) {
                requiredFields[i].style.borderBottomColor = "red";
            }
            if (requiredFieldValues[i]) {
                requiredFields[i].style.borderBottomColor = "rgb(117, 121, 99)";
            }
        }
    })
}

export const changeRequiredFieldsColor = (requiredFields, requiredFieldValues, newColor, previousColor) => {

    for (var i = 0; i < requiredFields.length; i++) {
        if (!requiredFieldValues[i]) {
            requiredFields[i].style.borderBottomColor = newColor;
        }
        if (requiredFieldValues[i]) {
            requiredFields[i].style.borderBottomColor = previousColor;
        }

    }
}

export const setNoneNegativeFieldsColor = (FieldsRefs, Values, Color1, Color2) => {
    for (var i = 0; i < FieldsRefs.length; i++) {
        if (Values[i] && Values[i] <= 0) {
            FieldsRefs[i].style.borderBottomColor = `${Color1}`;
        }
        else if (Values[i] && Values[i] > 0) {
            FieldsRefs[i].style.borderBottomColor = `${Color2}` ;
        }
    }
}

export const setGroupOfNoneZeroFieldsRed = (requiredFields, requiredFieldValues) => {

    for (var i = 0; i < requiredFields.length; i++) {
        if (requiredFieldValues[i] === 0) {
            requiredFields[i].style.borderBottomColor = "rgb(117, 121, 99)";
        }
        if (requiredFieldValues[i] !== 0) {
            requiredFields[i].style.borderBottomColor = "white";
        }
    }
}

export const setFieldColorWhite = (noneRequiredFields) => {
    flushSync(() => {
        for (var i = 0; i < noneRequiredFields.length; i++) {
            noneRequiredFields[i].style.borderBottomColor = "white";
        }
    })
}

export const setFieldColorRed = (requiredFields) => {
    flushSync(() => {
        for (var i = 0; i < requiredFields.length; i++) {
            requiredFields[i].style.borderBottomColor = "rgb(117, 121, 99)";
        }
    })
}

export const setFieldColor = (ArrayOfrequiredFields, color) => {

    for (var i = 0; i < ArrayOfrequiredFields.length; i++) {
        ArrayOfrequiredFields[i].style.borderBottomColor = color;

    }
}

export const setNonNegativeFieldsColorRed = (requiredFields, noneRequiredFields) => {
    flushSync(() => {
        setFieldColorRed(requiredFields);
        setFieldColorWhite(noneRequiredFields);
    })
}

export const setMultiColoredArrayItems = (Array, color1, color2, indexPropFromMapping) => {
    flushSync(() => {
        for (var i = 0; i < Array.length; i++) {
            if (indexPropFromMapping % 2 === 0) {
                Array[i].style.borderBottomColor = `${color2}`;
            }
            else if (indexPropFromMapping % 2 !== 0) {
                Array[i].style.borderBottomColor = `${color1}`;
            }
        }
    })
}
export default setRequiredFieldsColorRed;