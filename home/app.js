
import {
    auth,
    onAuthStateChanged,
    doc,
    db,
    getDoc,
    signOut,
    storage,
    uploadBytesResumable,
    getDownloadURL,
    ref,
    addDoc,
    collection,
    query,
    getDocs


} from "../firebase.js";







let userDetails;

onAuthStateChanged(auth, async (user) => {
    if (user) {

        const uid = user.uid;
        console.log("user uid", uid)

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            userDetails = docSnap.data()
            userDetails.uid = uid
            console.log(userDetails, "userDetails")
            const { userName } = docSnap.data()
        } else {

            console.log("No such document!");
        }

    } else {

        setTimeout(() => {
            window.location.href = "../login/login.html"
        }, 2000)

    }
});

const logOutBtn = document.getElementById("logOutBtn")

logOutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        alert("Logout Successfully ")
    }).catch((error) => {
        console.log("Not Log out error aa raha hai")
    });

})



let postCreate = () => {
    console.log("Clcik howa ho mai")
    let postValue = document.querySelector("#postValue")
    let feedPicupload = document.querySelector("#feedPicupload")

    console.log(feedPicupload.files[0], "File images")
    console.log(postValue.value)

    let imageUrl = feedPicupload.files[0]

    const date = new Date()


    const storageRef = ref(storage, `images/${date.getTime()}`);

    const uploadTask = uploadBytesResumable(storageRef, imageUrl);

    let downloadImageUrl;


    uploadTask.on('state_changed',
        (snapshot) => {

            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {

        },
        () => {

            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);
                downloadImageUrl = downloadURL
                try {
                    // Add a new document with a generated id.
                    const docRef = await addDoc(collection(db, "users"), {
                        textData: postValue.value,
                        imgData: downloadImageUrl,
                        authorDetails: {
                            name: userDetails.userName,
                            img: userDetails.imgUrl || "",
                            uid: userDetails.uid,
                        },
                    });
                    console.log("Document written with ID: ", docRef.id);
                    
                    fetchData()
                    // postFetchFunction();
                } catch (error) {
                    console.log(error, "==>> error bata raha hun");
                }
            });
        }
    );

    

    
}


const postCreateBtn = document.querySelector("#postCreateBtn")

postCreateBtn.addEventListener("click", postCreate)


const showpostFunction = (postData) => {
    const postUsers = document.querySelector(".postUsers")

    postUsers.innerHTML += `<div class="postArea">
                            <div class="usertop">
                                <div class="userPost">
                                    <div class="profile-picture" id="my-profile-picture">
                                        
                                        <img src="../assests/feed4.jpg" alt="">
                
                                    </div>
                                    <div class="info">
                                        <span>${postData.authorDetails.name}</span>
                                        <small>Pakistan, <span>1 Hour Ago</span></small>

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




let fetchData = async () => {
    const postUsers = document.querySelector(".postUsers")
    postUsers.innerHTML = ""
    const q = query(collection(db, "users"));

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

        console.log(doc.id, " => ", doc.data());
        showpostFunction(doc.data())

    });
    
    } catch (error) {
        console.log("error aa raha hai",error)
        
    }
}

fetchData()









const popup = document.querySelector('.popup');
const openPopupBtn = document.getElementById('addpostBtn');
const closePopupBtn = document.querySelector('.popup .close');


function showPopup() {
    popup.style.display = 'flex';
}


function hidePopup() {
    popup.style.display = 'none';
}


openPopupBtn.addEventListener('click', showPopup);
closePopupBtn.addEventListener('click', hidePopup);


document.querySelector("#feedPicupload").addEventListener("change", () => {
    document.querySelector("#myImage").src = URL.createObjectURL(document.querySelector("#feedPicupload").files[0])

})



let swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 4,
});