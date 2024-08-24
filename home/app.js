
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
    getDocs,
    deleteDoc,
    updateDoc


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
            const { userName, imgUrl } = docSnap.data()

            document.querySelector("#homeProfile").src = imgUrl || "../assests/feed4.jpg"
            document.querySelector("#HomeLeftProfile").src = imgUrl || "../assests/feed4.jpg"
            document.querySelector("#homeLeftname").innerHTML = userName.slice(0,1).toUpperCase()+userName.slice(1) || "Shahbaz"

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
        Swal.fire({
            title: `LogOut Successfully`,
            text: "Best of Luck",
            icon: "success"
        });
    }).catch((error) => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${error.message}`,
            
          });
    });

})



let postCreate = () => {
    console.log("Clcik howa ho mai")
    let postValue = document.querySelector("#postValue")
    let feedPicupload = document.querySelector("#feedPicupload")

    console.log(feedPicupload.files[0], "File images")
    console.log(postValue.value)

    let imageUrl = feedPicupload.files[0]

    let date = new Date()


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
                    const docRef = await addDoc(collection(db, "posts"), {
                        textData: postValue.value,
                        imgData: downloadImageUrl,
                        authorDetails: {
                            name: userDetails.userName,
                            img: userDetails.imgUrl || "",
                            uid: userDetails.uid,
                        },
                        timestamp: new Date()
                    });
                    console.log("Document written with ID: ", docRef.id);

                    fetchData()
                    hidePopup()
                    postValue.value = ""
                    

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

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 3600;

    if (interval < 1) {
        interval = seconds / 60;
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


const showpostFunction = (postData,postId) => {
    const postUsers = document.querySelector(".postUsers")
    const postTime = postData.timestamp.toDate();  
    const timeAgoText = timeAgo(postTime);
    let postUsername = postData.authorDetails.name.slice(0,1).toUpperCase()+postData.authorDetails.name.slice(1) 
    let userPostTopImage = postData.authorDetails.img || "../assests/feed4.jpg"


    postUsers.innerHTML += `<div class="postArea">
                            <div class="usertop">
                                <div class="userPost">
                                    <div class="profile-picture" id="my-profile-picture">
                                        
                                        <img src= "${userPostTopImage}" alt="">
                
                                    </div>
                                    <div class="info">
                                        <b><span>${postUsername}</span></b>
                                        <small>Pakistan, <span>${timeAgoText}</span></small>

                                    </div>
                                </div>

                                <span class="edit">
                                    <img src="../assests/three-dots.svg" alt="">
                                    <ul class="edit-menu ">
                                        <li id="editBtn" onclick="editHandler('${postId}', '${postData.authorDetails.uid}', '${postData.textData}', '${postData.imgData}')"><i  class="fa fa-pen"></i>Edit</li>
                                        <li id="deletedBtn" onclick="deleteHandler('${postId}','${postData.authorDetails.uid}')"><i  class="fa fa-trash"></i>Delete</li>
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
                                    <p><b>Umer Abbas</b> and <b>77 other comments</b></p>
                                </div>
                            </div>

                        </div>`
}




let fetchData = async () => {
    const postUsers = document.querySelector(".postUsers")
    postUsers.innerHTML = ""
    const q = query(collection(db, "posts"));

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {

            console.log(doc.id, " => ", doc.data());
            showpostFunction(doc.data(),doc.id)

        });

    } catch (error) {
        console.log("error aa raha hai", error)

    }
}

fetchData()


let deleteHandler = async (postId, postAuthorUid) => {
    console.log(postId,postAuthorUid,userDetails.uid)
    if (userDetails.uid === postAuthorUid) {
        try {
            await deleteDoc(doc(db, "posts", postId));
            console.log("Post deleted successfully");
            fetchData(); 
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    } else {
        Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "You can only delete your own posts!",
        });
    }
};

window.deleteHandler = deleteHandler

let editHandler = async (postId, postAuthorUid, currentText, currentImage) => {
    if (userDetails.uid === postAuthorUid) {
        document.querySelector("#postValue").value = currentText;
        document.querySelector("#myImage").src = currentImage;
        showPopup(); 

        document.querySelector("#postCreateBtn").removeEventListener("click", postCreate);
        postCreateBtn.style.display = "none"

        const saveEditBtn = document.querySelector("#saveEditBtn");

        saveEditBtn.style.display = 'block';
        saveEditBtn.addEventListener("click", async () => {
            const newText = document.querySelector("#postValue").value;
            const newImage = document.querySelector("#feedPicupload").files[0];

            let downloadImageUrl = currentImage;

            if (newImage) {
                const storageRef = ref(storage, `images/${Date.now()}`);
                const uploadTask = uploadBytesResumable(storageRef, newImage);
                await uploadTask.then(async (snapshot) => {
                    downloadImageUrl = await getDownloadURL(snapshot.ref);
                });
            }

            try {
                await updateDoc(doc(db, "posts", postId), {
                    textData: newText,
                    imgData: downloadImageUrl
                });
                console.log("Post updated successfully");
                hidePopup(); 
                fetchData(); 
                postCreateBtn.style.display="block"
            } catch (error) {
                console.error("Error updating post:", error);
            }
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Unauthorized",
            text: "You can only edit your own posts!",
        });
    }
};

window.editHandler = editHandler;
     









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

