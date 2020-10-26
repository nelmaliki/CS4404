//TODO: Make client-side js that reads json from server-side and puts voting results in a ul in the webpage
const votesList = document.getElementById("votes")
const votesForm = document.querySelector("form")

function addNewVote(candidate, voteNum) {
    const newListItem = document.createElement("li")
    newListItem.innerText = candidate + '\t' + voteNum
    votesList.appendChild(newListItem)
}

fetch("/votes")
    .then(res => res.json())
    .then(vvvvvvv => {
        let candidates = vvvvvvv.nameCandidate
        let votes = vvvvvvv.numVotes
        //remove loading message
        votesList.firstElementChild.remove()
        //iterate through every new vote and add it to the page
        for (let i = 0; i < candidates.length; i++) {
            addNewVote(candidates[i], votes[i])
        }
    })
//Listen for the form to be submitted and add the vote
votesForm.addEventListener("submit", event => {
    //TODO: get fields, do validation, send to server using restAPI path voteFcn, do a fetch like above and put it in the votes form
    // fetch input, OBJECT where object is the request of what you want to send, specify what vote you want to add
    //Stop form from refreshing the page
    event.preventDefault()

    //get new values

    let ssn = votesForm.elements.ssn.value
    console.log(ssn)
    let voterName = votesForm.elements.name.value
    let vote = votesForm.elements.vote.value
    if (vote === 'writein') vote = votesForm.elements.writein.value
    let nameRegex = /^([A-Z][a-z][0-9][ -]){2,20}/
    if (nameRegex.test(name)) {//parse inputs
        //TODO: Move this to client. Send res.json({res:true,message:STRING})
        window.alert("Invalid input. Name can only contain A-Z, a-z, 0-9, and spaces/hyphens.")
        return;
    }
    if (nameRegex.test(vote) || vote === '') {
        window.alert("Invalid input. Write can only contain A-Z, a-z, 0-9, and spaces/hyphens.")
        return;
    }
    let stringThing = JSON.stringify({ssn: ssn, name: voterName, candidate: vote})
    console.log(stringThing)
    //Input can now be sent to server
    return fetch("/voteFcn", {
        method: "POST",
        body: JSON.stringify({ssn: ssn, name: voterName, candidate: vote}),
        headers: {"Content-Type": "application/json"}
    })
        .then(res => res.json())
        .then(json => {
            if(json.res ===true)
                window.alert(json.message)
            else if(json.res===false){
                window.alert(json.message)
                votesForm.reset()
                votesForm.elements.vote.focus()
            }
            //reset form
            votesForm.reset()
            votesForm.elements.vote.focus()
        })
})

