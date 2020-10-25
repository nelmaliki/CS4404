//TODO: Make client-side js that reads json from server-side and puts voting results in a ul in the webpage
const votesList = document.getElementById("votes")
const votesForm = document.querySelector("form")

function addNewVote(candidate, voteNum) {
    const newListItem = document.createElement("li")
    newListItem.innerText = candidate + '\t' + voteNum
    votesList.appendChild(newListItem)
}

fetch("/votes")
    .then(res=>res.json())
    .then(vvvvvvv => {
        let candidates = vvvvvvv.nameCandidate
        let votes = vvvvvvv.numVotes
        //remove loading message
        votesList.firstElementChild.remove()
        //iterate through every new vote and add it to the page
        for(let i = 0; i < candidates.length; i++) {
            addNewVote(candidates[i], votes[i])
        }
    })
//Listen for the form to be submitted and add the vote
votesForm.addEventListener("submit", event => {
    //Stop form from refreshing the page
    event.preventDefault()
    //get new values
    let newVote = votesForm.elements.vote.value
    votes.push(newVote)
    addNewVote(newVote)
    //reset form
    votesForm.reset();
    votesForm.elements.vote.focus()
})

