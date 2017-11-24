function convertSSML(name) {
    let tag = '';

    if (name) {
        tag = "<audio src='https://s3.amazonaws.com/voice-quiz/"+ name +"' />"
    }

    return tag;
}

module.exports = convertSSML;