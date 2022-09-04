
//constant values to adjust time zone
const MIN_HOUR = 8
const MAX_HOUR = 16
const SERVER_OFFSET = -5

//constant defining the chat elements in the HTML
const chatContainer = document.getElementById("chat-container")
const sendButtonContainer = document.getElementById("sendButton")
const userTextContainer = document.getElementById("userText")

sendButtonContainer.addEventListener("click", buildChat)

userTextContainer.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        buildChat()
    }
});


//This function insert the user and chat messages in the chat box, 
// also validate the remaining time in days, hours and minutes to begin working hours
function buildChat() {
    if (userText.value === '') {
        return
    } 

    chatContainer.innerHTML += `<p class="message-incoming"> ${userText.value} </p>`
    userText.value = ''

    let answer = ''
    const now = getServerHour()
    const nextDay = getNextAvailableDay(now)
    
    const timeDiff = TimeDiff(now, nextDay)

    if (timeDiff.days > 0 || timeDiff.hours > 0 || timeDiff.minutes > 0 || timeDiff.seconds > 0) {
        answer= `
            An agent will be available in the next 
            ${timeDiff.days !== 0 ? timeDiff.days + ' days' : ''} 
            ${timeDiff.hours !== 0 ? timeDiff.hours + ' hours' : ''} 
            ${timeDiff.minutes !== 0 ? timeDiff.minutes + ' minutes' : ''} 
            ${timeDiff.seconds !== 0 ? timeDiff.seconds + ' seconds' : ''} 
        `
    } else {
        answer= "Welcome to my store 😊, how can I help you?"
    }

    chatContainer.innerHTML += `<p class="message-outcoming"> ${answer} </p>`
}   
 

//This function is used to calculate the next working day
function getNextAvailableDay(date) {
    const nextDay = new Date(date)
    const dayOfWeek = date.getDay()
    const currentHour = date.getHours()

    //Check if day is Mon-Fri
    if(dayOfWeek > 0 && dayOfWeek < 6) {
        if (currentHour >= MIN_HOUR && currentHour < MAX_HOUR) {
           return nextDay
        }
    }

    switch (dayOfWeek) {
        case 6:
            // Saturday
            nextDay.setDate(nextDay.getDate() + 2)
            break
        case 5:
            // Friday
            nextDay.setDate(nextDay.getDate() + 3)
            break    
        default:
            // Sun. Mon, Tus, Wen, Thu
            nextDay.setDate(nextDay.getDate() + 1)
            break
    }

    nextDay.setHours(MIN_HOUR)
    nextDay.setMinutes(0)
    return nextDay
    
}

// This function get the user time zone and compensates the time difference between user location and Colombia.
function getServerHour() {
    const now = new Date()
    console.log(now)
    const currentOffset = -1*(now.getTimezoneOffset() / 60)
    const diffTimezone = currentOffset - SERVER_OFFSET
    now.setMinutes(now.getMinutes() + diffTimezone*60)
    return now
}

// This function transform the milliseconds time into days, hours, minutes and seconds. 
// Is used to give an exact time remaining when user types out of working time.
function TimeDiff(dateInit, dateEnd){
    const ms = dateEnd.getTime() - dateInit.getTime()

    let seconds = Math.floor(ms / 1000)
    let minutes = Math.floor(seconds / 60)
    seconds = seconds % 60
    let hours = Math.floor(minutes / 60)
    minutes = minutes % 60
    const days = Math.floor(hours / 24)
    hours = hours % 24

    return {
        days,
        hours,
        minutes,
        seconds,
    }
}