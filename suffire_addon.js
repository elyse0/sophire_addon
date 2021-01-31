let switch_value = false
let verbs_url = "https://french-verbs.herokuapp.com/verbs/random"
let vocabulary_url = "https://french-verbs.herokuapp.com/vocabulary/random"

function get_switch(){

    switch_value = !switch_value

    console.log(switch_value)
    return switch_value
}

function find_tab_id_by_url(tabs, url){

    let i;

    for( i = 0; i < tabs.length ; i++){
        if(tabs[i].url === url){
            return tabs[i].id
        }
    }
    return null
}

function reload_and_active_tab_by_id(tab_id){

    browser.tabs.reload(tab_id)
    browser.tabs.update(tab_id, {active: true})
}

function create_and_active_tab(url, index){

    browser.tabs.create({
        active: true,
        url: url,
        index: index
    })
}

function update_or_create_verbs_tab(tabs){

    let tab_id = find_tab_id_by_url(tabs, verbs_url)

    if (tab_id != null)
        reload_and_active_tab_by_id(tab_id)
    else
        create_and_active_tab(verbs_url, 1)
}

function update_or_create_vocabulary_tab(tabs){

    let tab_id = find_tab_id_by_url(tabs, vocabulary_url)

    if (tab_id != null)
        reload_and_active_tab_by_id(tab_id)
    else
        create_and_active_tab(vocabulary_url, 2)
}

function suffire_tabs(tabs) {

    // True -> Verbs
    // False -> Vocabulary

    if (get_switch())
        update_or_create_verbs_tab(tabs)
    else
        update_or_create_vocabulary_tab(tabs)
}

let periodInMinutes = 0.1;

browser.alarms.create({
    periodInMinutes
})

function handle_alarm(alarmInfo) {
    browser.tabs.query({currentWindow: true}, suffire_tabs)
}

browser.alarms.onAlarm.addListener(handle_alarm);