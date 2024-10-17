import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getBlob,
    listAll,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence,
    deleteUser
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
    getDatabase,
    set,
    onValue,
    child,
    get,
    remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import {
    deletarEducador,
    pegarDatabase
} from "../controller/EducadorController.js";
import {
    deletarConteudo
} from "./ConteudoController.js";
import {
    deletarEstudante
} from "./EstudanteController.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8w_7KRWrWsLEKm7LTEHzTktQZnMP2uBs",
    authDomain: "nihao-hub.firebaseapp.com",
    databaseURL: "https://nihao-hub-default-rtdb.firebaseio.com",
    projectId: "nihao-hub",
    storageBucket: "nihao-hub.appspot.com",
    messagingSenderId: "810776748319",
    appId: "1:810776748319:web:439604a07a954f33c1d02a",
    measurementId: "G-CTM4WJV04D"
};

const app = initializeApp(firebaseConfig);
const dbRef = pegarDatabase();
const storage = getStorage();
const listRef = ref(storage, '/');
const auth = getAuth();
const user = auth.currentUser;

const divConteudosAdministrador = document.getElementById("conteudosAdministrador");
const divUsuariosAdministrador = document.getElementById("usuariosAdministrador");

function detalhesConteudo() {
    var name = $(this).attr("name");
    getDownloadURL(ref(storage, "/" + name))
        .then((url) => {

            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();

            window.location = "../view/ConteudoView.html?url=" + url + "&id=" + $(this).attr("id");

        })
        .catch((error) => {
            // Handle any errors
        });
};

setPersistence(auth, browserSessionPersistence)
    .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        $("#emailGeral").html(auth.currentUser.email);
        return signInWithEmailAndPassword(auth, email, password);
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });

listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {
            let div = document.getElementById("conteudosAdministrador");
            let a = document.createElement("a");
            let p = document.createElement("p");
            a.setAttribute("class", "pdfDowload");
            a.setAttribute("name", itemRef["_location"]["path_"]);
            a.setAttribute("target", "_blank");
            get(child(dbRef, 'Conteudo/')).then((snapshot) => {
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();

                    if (snapshot.exists()) {
                        if (childData.nomeConteudo == itemRef["_location"]["path_"]) {
                            a.innerHTML = "Id: " + childData.idConteudo + " Nome: " + itemRef["_location"]["path_"];
                            a.setAttribute("id", childData.idConteudo);
                            a.addEventListener("click", detalhesConteudo, false)
                            p.appendChild(a);
                            div.appendChild(p);
                        }
                    } else {
                        console.log("No data available");
                    }
                });
            }).catch((error) => {
                console.error(error);
            });
        });
    }).catch((error) => {
        // Uh-oh, an error occurred!
    });

get(child(dbRef, 'Educador/')).then((snapshot) => {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();

        if (snapshot.exists()) {
            let div = document.getElementById("usuariosAdministrador");
            let a = document.createElement("a");
            let p = document.createElement("p");
            a.innerHTML = "Id: " + childData.idEducador + " Nome: " + childData.nomeEducador + " Email: " + childData.loginEducador + " Classe: Educador";
            p.appendChild(a);
            div.appendChild(p);
        } else {
            console.log("No data available");
        }
    });
}).catch((error) => {
    console.error(error);
});

get(child(dbRef, 'Estudante/')).then((snapshot) => {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();

        if (snapshot.exists()) {
            let div = document.getElementById("usuariosAdministrador");
            let a = document.createElement("a");
            let p = document.createElement("p");
            a.innerHTML = "Id: " + childData.idEstudante + " Nome: " + childData.nomeEstudante + " Email: " + childData.loginEstudante + " Classe: Estudante";
            p.appendChild(a);
            div.appendChild(p);
        } else {
            console.log("No data available");
        }
    });
}).catch((error) => {
    console.error(error);
});

$("#excluirEducador").click(function () {
    deletarEducador(user);
});

$("#excluirConteudo").click(function () {
    if ($("#valorExcluirConteudo").val() != null) {
        var valor = $("#valorExcluirConteudo").val();
        get(child(dbRef, 'Conteudo/' + valor)).then((snapshot) => {
            var childData = snapshot.val();
            const desertRef = ref(storage, childData.nomeConteudo);
            deleteObject(desertRef).then(() => {
                deletarConteudo();
            }).catch((error) => {
                // Uh-oh, an error occurred!
            });

        }).catch((error) => {
            console.error(error);
        });
    }
});

$("#excluirEstudante").click(function () {
    deletarEstudante();
});