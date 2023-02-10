const setStatuscodeErrorMessage = (statuscode, setFeedback) => {
    if (statuscode === 401) {
        setFeedback("Unathorized...")
    }
    else if (statuscode === 400) {
        setFeedback('Bad request...')
    }
    else if (statuscode === 405) {
        setFeedback('Method not allowed...');
    }
    else if (statuscode === 403) {
        setFeedback("Error, request not allowed...")
    }
    else if (statuscode === 404) {
        setFeedback("Error, server rejected...")
    }
    else if (statuscode === 409) {
        setFeedback("Similar identity exists")
    }
    else if (statuscode === 500) {
        setFeedback("Internal error...")
    }
}

export default setStatuscodeErrorMessage;