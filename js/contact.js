const submitContact = async (event) => {
    event.preventDefault()
    const url = "";//URL to modify
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    let response = document.createElement("p");
    //Impossible to finish as we dont have a server, but the whole request is done frontend-wise
    if (email.value && validateEmail(email.value)) {
        const answer = await fetch(url, 
            {method:"POST",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({ email : email.value, message: message.value})}
        )

        if (answer.ok){
            response.textContent = "Your message has been successfully sent"
        }
        else{
            //Since no backend configured, will always write this
            response.textContent = "Error in connexion"
        }

    }
    else{
        
        response.textContent = "Please enter a valid address email"
        
    }
    document.getElementById("sent-us").appendChild(response)
}


const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};