const votesList = document.getElementById("votes")
const votesForm = document.querySelector("form")
const mainElement = document.querySelector("main")

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
function replaceForm(){
    document.querySelector("h2").remove()
    document.querySelector("p").innerText = "Please click continue to choose who to vote for"
    votesForm.remove()
    const continueButton = document.createElement("button")
    continueButton.innerText = "Continue"
    continueButton.onclick = function(){
        location.href = "/ballot"
    }
    mainElement.append(continueButton)

}
//Listen for the form to be submitted and add the vote
votesForm.addEventListener("submit", event => {

    event.preventDefault()
    let ssNumber = votesForm.elements.ssn.value
    let voterName = votesForm.elements.name.value
    if (!/^[a-zA-Z0-9][a-zA-Z0-9\s-]*$/.test(voterName)) {//parse inputs
        alert("Invalid input. Name can only contain A-Z, a-z, 0-9, and spaces/hyphens.")
        return;
    }
    if (!/^([0-9])*$/.test(ssNumber) || ssNumber === '' || !(ssNumber.length !== '9')) {
        alert(`Invalid input for SSN "${ssNumber}" with length "${ssNumber.length}". Enter nine digits with no spaces or symbols.`)
    }
    replaceForm()
    return fetch("/requestBallot", {
        method: "POST",
        body: JSON.stringify({ssn: ssNumber, name: voterName}),
        headers: {"Content-Type": "application/json"}
    })
        .then(res => res.json())
        .then(json => {
            if(json.res ===true) {
                alert(json.message)
                location.reload()
            }
            else if(json.res===false){
                alert(json.message)
                location.reload()
            }
            //reset form
            votesForm.reset()
        })
})


