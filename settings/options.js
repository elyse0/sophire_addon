function get_float_from_period_form(){

    let period = parseFloat(document.querySelector("#period").value)
    if(isNaN(period))
        period = 1

    console.log(period)
    return period
}

function get_boolean_from_verbs_form(){

    return document.querySelector("#verbs").value !== "false"
}

function get_boolean_from_vocabulary_form(){

    return document.querySelector("#vocabulary").value !== "false"
}

function save_options(e) {
    e.preventDefault();

    browser.storage.local.set({
        period: get_float_from_period_form(),
        verbs: get_boolean_from_verbs_form(),
        vocabulary: get_boolean_from_vocabulary_form()
    });

    reset_alarm(get_float_from_period_form())
}

function reset_alarm(period){

    // Reset alarm to new value
    browser.alarms.clear("sophire")
    browser.alarms.create("sophire", {periodInMinutes: period})
}

function restore_options() {

    browser.storage.local.get({
        period: 1,
        verbs: true,
        vocabulary: true
    }, (data, error) => {

        if(!error){
            document.querySelector("#period").value = data.period
            document.querySelector("#verbs").value = data.verbs
            document.querySelector("#vocabulary").value = data.vocabulary
        }
    })
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("form").addEventListener("submit", save_options);
