import {
    auth,
    getDoc,
    doc,
    db,
    onAuthStateChanged,
    query,
    collection,
    getDocs,
    ref,
    storage,
    uploadBytesResumable,
    setDoc,
    getDownloadURL
} from "../firebase.js";





let userDetails;
let userUID;
onAuthStateChanged(auth, async (user) => {
    if (user) {

        const uid = user.uid;
        console.log("user uid", uid)

        userUID = uid

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            userDetails = docSnap.data()
            userDetails.uid = uid
            console.log(userDetails, "userDetails")
             const { userName ,imgUrl,education,designation,address,hobbies } = docSnap.data()

            
            document.querySelector("#userName").innerHTML =userName.slice(0,1).toUpperCase()+userName.slice(1) || "Anonymous"
            document.querySelector("#userProfile").src = imgUrl || "../assests/feed4.jpg"
            document.querySelector("#userEducation").innerHTML = education || "Matriculation"
            document.querySelector("#userDesignation").innerHTML = designation || "Student"
            document.querySelector("#userAddress").innerHTML = address || "Karachi"
            document.querySelector("#userHobbies").innerHTML = hobbies || "Football"
            document.querySelector("#userInputPic").src = imgUrl || "../assests/feed4.jpg"
        } else {

            console.log("No such document!");
        }

    } else {

        setTimeout(() => {
            window.location.href = "../login/login.html"
        }, 2000)

    }
});



function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    console.log(seconds)
    let interval = seconds / 3600;
    console.log(interval)

    if (interval < 1) {
        interval = seconds / 60;
        console.log(interval)
        if (interval < 1) {
            return "just now";
        } else if (interval < 2) {
            return "1 minute ago";
        } else {
            return Math.floor(interval) + " minutes ago";
        }
    } else if (interval < 24) {
        if (interval < 2) {
            return "1 hour ago";
        } else {
            return Math.floor(interval) + " hours ago";
        }
    } else {
        interval = interval / 24;
        if (interval < 2) {
            return "1 day ago";
        } else {
            return Math.floor(interval) + " days ago";
        }
    }
}



const showpostFunction = (postData) => {
    const postUsers = document.querySelector(".postUsers")
    const postTime = postData.timestamp.toDate();  
    const timeAgoText = timeAgo(postTime);
    let postUsername = postData.authorDetails.name.slice(0,1).toUpperCase()+postData.authorDetails.name.slice(1) 
    let userPostTopImage = postData.authorDetails.img || "../assests/feed4.jpg"

     console.log(postData)

    postUsers.innerHTML += `<div class="postArea">
                            <div class="usertop">
                                <div class="userPost">
                                    <div class="profile-picture" id="my-profile-picture">
                                        
                                        <img src="${userPostTopImage}" alt="">
                
                                    </div>
                                    <div class="info">
                                        <b><span>${postUsername}</span></b>
                                        <small>Pakistan, <span>${timeAgoText}</span></small>

                                    </div>
                                </div>

                                <span class="edit">
                                    <img src="../assests/three-dots.svg" alt="">
                                    <ul class="edit-menu ">
                                        <li><i class="fa fa-pen"></i>Edit</li>
                                        <li><i class="fa fa-trash"></i>Delete</li>
                                    </ul>
                                </span>

                            </div>

                            <div class="postImg">
                                <h5>${postData.textData}</h5>
                                <img src="${postData.imgData}" alt="">
                            </div>

                            <div class="actionButton">
                                <div class="likedBtn">
                                    <span><i class="fa fa-heart"></i></span>
                                    <span><i class="fa fa-comment-dots"></i></span>
                                    <span><i class="fa fa-link"></i></span>
                                </div>

                                <div class="bookmark">
                                    <i class="fa fa-bookmark"></i>
                                </div>
                            </div>

                            <div class="usercomment">
                                <div class="commentArea">
                                    <img src="../assests/n3.png" alt="">
                                    <img src="../assests/n1.jpg" alt="">
                                    <img src="../assests/n4.png" alt="">
                                </div>
    
                                <div class="Comment">
                                    <p><b>John Williams</b> and <b>77 comments other</b></p>
                                </div>
                            </div>

                        </div>`
}








let educationInput = document.querySelector("#educationInput")
let designationInput = document.querySelector("#designationInput")
let addressInput = document.querySelector("#addressInput")
let hobbiesInput = document.querySelector("#hobbiesInput")
let profilePictureInput = document.querySelector("#profilePictureInput")


let updateData = async() => {

    console.log(profilePictureInput.files[0]);

    const file = profilePictureInput.files[0];


    const date = new Date();


    const storageRef = ref(storage, `images/${date.getTime()}`);

    const uploadTask = uploadBytesResumable(storageRef, file);


    uploadTask.on(
        "state_changed",
        (snapshot) => {

            const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
                case "paused":
                    console.log("Upload is paused");
                    break;
                case "running":
                    console.log("Upload is running");
                    break;
            }
        },
        (error) => {
            console.log("Error", error)
        },
        () => {

            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log("File available at", downloadURL);

                console.log(
                    educationInput.value,
                    designationInput.value,
                    addressInput.value,
                    hobbiesInput.value
                );
                try {
                    
                    const response = await setDoc(doc(db, "users", userUID), {

                        education: educationInput.value,
                        designation: designationInput.value,
                        address: addressInput.value,
                        email: userDetails.email,
                        hobbies: hobbiesInput.value,
                        imgUrl: downloadURL,
                        userName: userDetails.userName,
                    

                    });
                    console.log(response, "==>> response");
                    document.querySelector("#closeBtn").click();

                    

                    const docRef = doc(db, "users", userUID);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                        userDetails = docSnap.data();
                        const {
                            education,
                            designation,
                            address,
                            hobbies,
                            imgUrl,
                            userName
                        } = docSnap.data();

                        
                        document.querySelector("#userProfile").src = imgUrl;
                        document.querySelector("#userEducation").innerHTML = education;
                        document.querySelector("#userDesignation").innerHTML = designation;
                        document.querySelector("#userAddress").innerHTML = address;
                        document.querySelector("#userHobbies").innerHTML = hobbies;
                        document.querySelector("#userInputPic").src = imgUrl
                        
                        
                    } else {
                        // docSnap.data() will be undefined in this case
                        console.log("No such document!");
                    }



                } catch (error) {
                    console.log("code phata", error);
                }
            });
        }
    );

}

const updateProfileBtn = document.querySelector("#updateProfileBtn")

updateProfileBtn.addEventListener("click", updateData)





let fetchData = async () => {
    const postUsers = document.querySelector(".postUsers")
    postUsers.innerHTML = ""
    const q = query(collection(db, "posts"));

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            console.log(doc.id, " => ", doc.data());
            // showpostFunction(doc.data())

            const { authorDetails } = doc.data()
            //console.log(authorDetails)

            if (authorDetails.uid === userUID) showpostFunction(doc.data())




        });

    } catch (error) {
        console.log("error aa raha hai", error)

    }
}

fetchData()

