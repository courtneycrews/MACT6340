(function () {
    "use strict";

    let form = document.querySelector('#contact-form')

    document.querySelector("#send-contact").addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        let formValid = true;
        if (!form.checkValidity()) {
            formValid = false;
        }
        form.classList.add('was-validated')
        if (formValid) {
            sendTheEmail();
        }
    });


    function sendTheEmail() {
        console.log("Thank you for your message.");
        let obj = {
            sub: "New Message from Reader",
            txt: `${document.querySelector("#contact-first").value} ${document.querySelector("#contact-last").value} sent a message that reads: ${document.querySelector("#contact-msg").value}. They're email address is ${document.querySelector("#contact-email-addr").value}`,
        };

        fetch("/mail", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(obj),
        })
        .then((r) => r.json())
        .then((response) => {
            document.querySelector("#contact-button-response").innerHTML = response.result;
        })
        .then(() => {
            setTimeout(() => {
                document.querySelector("#contact-button-response").innerHTML = "";
            }, "5000");
        });
    }       
})();