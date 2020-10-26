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
        //votesList.firstElementChild.remove()
        votesList.innerHTML=''
        //iterate through every new vote and add it to the page
        for (let i = 0; i < candidates.length; i++) {
            addNewVote(candidates[i], votes[i])
        }
    })
//Listen for the form to be submitted and add the vote
votesForm.addEventListener("submit", event => {
    //Stop form from refreshing the page
    event.preventDefault()

    //get new values

    let ssNumber = votesForm.elements.ssn.value
    console.log(ssNumber)
    let voterName = votesForm.elements.name.value
    let vote = votesForm.elements.vote.value
    if (vote === 'writein') vote = votesForm.elements.writein.value
    //Check for valid input before sending to server
    if (!/^[a-zA-Z0-9][a-zA-Z0-9\s-]*$/.test(voterName)) {//parse inputs
        alert("Invalid input. Name can only contain A-Z, a-z, 0-9, and spaces/hyphens.")
        return;
    }
    if (!/^[a-zA-Z0-9][a-zA-Z0-9\s-]*$/.test(vote)) {
        alert(`Invalid input "${vote}". Write-In can only contain A-Z, a-z, 0-9, and spaces/hyphens.`)
        return;
    }
    if (!/^([0-9])*$/.test(ssNumber) || ssNumber === '' || !(ssNumber.length !== '9')) {
        alert(`Invalid input for SSN "${ssNumber}" with length "${ssNumber.length}". Enter nine digits with no spaces or symbols.`)
    }
    //Input can now be sent to server
    return fetch("/voteFcn", {
        method: "POST",
        body: JSON.stringify({ssn: ssNumber, name: voterName, candidate: vote}),
        headers: {"Content-Type": "application/json"}
    })
        .then(res => res.json())
        .then(json => {
            if(json.res ===true) {
                window.alert(json.message)
                votesForm.reset()
            }
            else if(json.res===false){
                alert(json.message)
                location.reload()
            }
            //reset form
            votesForm.reset()
        })
})

