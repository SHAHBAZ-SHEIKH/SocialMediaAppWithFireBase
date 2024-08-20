import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from "./firebase.js";


let signupBtn = document.getElementById("signupBtn");
signupBtn.addEventListener("click", async () => {
    console.log("Button clicked");
    
    let userName = document.getElementById("userName");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let cpassword = document.getElementById("cpassword");

    if(userName.value.includes("@")){
        return alert("user Name not email Address")
    }

    if (!userName.value || !email.value || !password.value || !cpassword.value) {
        return alert("All fields are required");
    }

    if (password.value !== cpassword.value) {
        return alert("Password and confirm password do not match");
    }

    if(password.value.length < 8){
        return alert('Password Length must be 8 character long');
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
            alert('Registered Successfully')
            setTimeout(() => {
                window.location.href = './login/login.html'
            }, 2000)
        } catch (e) {
            console.error("Error adding document in firestore database: ", e);
        }
    } catch (error) {
        console.log(error, "===>> authentication ka catch");
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
