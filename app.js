import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from "./firebase.js";


let signupBtn = document.getElementById("signupBtn");
signupBtn.addEventListener("click", async () => {
    console.log("Button clicked");

    let userName = document.getElementById("userName");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let cpassword = document.getElementById("cpassword");

    if (userName.value.includes("@")) {
        return alert("user Name not email Address")
    }

    if (!userName.value || !email.value || !password.value || !cpassword.value) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all fields",

        });

        return;
    }

    if (password.value !== cpassword.value) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Password and confirm password must be the same",

        });

        return;
    }

    if (password.value.length < 8) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Password length must be 8 characters long",

        });

        return;
    }



    try {
        //authentication implementationF
        const response = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );
        console.log(response, "===>> response");

        const { user: { uid }, } = response;

        // return;

        //data store in database

        try {
            const docRef = setDoc(doc(db, "users", uid), {
                userName: userName.value,
                email: email.value,
            });
            console.log("Document written with ID: ", docRef.id);
            Swal.fire({
                title: `${userName.value} Account Created Successfully`,
                text: "Congratulations!",
                icon: "success"
            });
            setTimeout(() => {
                window.location.href = './login/login.html'
            }, 2000)
        } catch (e) {
            console.error("Error adding document in firestore database: ", e);
        }
    } catch (error) {
        console.log(error.message, "===>> authentication ka catch");
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error.message}`,

        });
    }
});

// ScrollReveal settings
ScrollReveal({
    distance: '800px',
    duration: 3000,
    delay: 200
});

ScrollReveal().reveal('.userInput', { origin: 'right' });
ScrollReveal().reveal('.join', { origin: 'left' });
