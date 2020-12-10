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

    let ssNumber = getCookie("ssn", document.cookie)
    let voterName = getCookie("name", document.cookie)
    let vote = votesForm.elements.vote.value
    if (vote === 'writein') vote = votesForm.elements.writein.value

    if (!/^[a-zA-Z0-9][a-zA-Z0-9\s-]*$/.test(vote)) {
        alert(`Invalid input "${vote}". Write-In can only contain A-Z, a-z, 0-9, and spaces/hyphens.`)
        return;
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

//code adapted from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname, decodedCookie) {
    let name = cname + "=";
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}