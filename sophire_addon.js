let switch_value = false
let verbs_url = "https://sophire.herokuapp.com/verbes/aleatoire"
let vocabulary_url = "https://sophire.herokuapp.com/vocabulaire/aleatoire"

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

    browser.tabs.executeScript(tab_id, {file: "scripts/reload_page.js"}, (data, err) => {

        if(err){
            console.log("Error executing script !")
        }
    })
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

function sophire_tabs(tabs) {

    // True -> Verbs
    // False -> Vocabulary

    browser.storage.local.get({
            period: 1,
            verbs: true,
            vocabulary: true
        }, (data, err) => {

        console.log("Verbs: " + data.verbs)
        console.log("Vocabulary: " + data.vocabulary)
        console.log("Period: " + data.period)

        if(!err){

                if(data.verbs && data.vocabulary){

                    if (get_switch())
                        update_or_create_verbs_tab(tabs)
                    else
                        update_or_create_vocabulary_tab(tabs)
                }else if(data.verbs){

                    update_or_create_verbs_tab(tabs)

                }else if(data.vocabulary){
                    update_or_create_vocabulary_tab(tabs)
                }
            }
        }
    )
}

function handle_alarm(alarmInfo) {
    browser.tabs.query({currentWindow: true}, sophire_tabs)
}

function create_alarm(period){

    browser.alarms.create("sophire", {
        periodInMinutes: period
    })

    browser.alarms.onAlarm.addListener(handle_alarm);
}

// Create alarm with values stored (default values are used if they don't exist)
browser.storage.local.get({
        period: 1,
        verbs: true,
        vocabulary: true
    }, (data, err) => {

        if(!err){

            create_alarm(data.period)
        }
    }
)

