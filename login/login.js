import { auth, signInWithEmailAndPassword} from "../firebase.js";

let loginHandler = ()=>{
    let email = document.querySelector("#email")
    let password = document.querySelector("#password")

    signInWithEmailAndPassword(auth, email.value.trim(), password.value.trim())
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert("user login",user)
    setTimeout(()=>{
      window.location.href = "../home/home.html"
    },2000)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("Error aa raha hai sambhalo")
  });


}


let loginBtn = document.querySelector("#loginBtn")

loginBtn.addEventListener("click",loginHandler)










ScrollReveal({
    distance:'800px',
    duration:3000,
    delay:200
})
    
    
ScrollReveal().reveal('.userInput', { origin:'left' });
ScrollReveal().reveal('.join', { origin:'right' });