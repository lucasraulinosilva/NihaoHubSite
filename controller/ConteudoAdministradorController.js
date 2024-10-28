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

            window.location = "../view/ConteudoAdministradorView.html?url=" + url + "&id=" + $(this).attr("id");

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

if (divConteudosAdministrador) {
    listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {
            let div = document.getElementById("conteudosAdministrador");
            let divGrande = document.createElement("div");
            let divPequena = document.createElement("div");
            let titulo = document.createElement("h5");
            let descricao = document.createElement("p");
            let nomeAutor = document.createElement("small");
            divGrande.setAttribute("class", "col-md-4");
            divPequena.setAttribute("class", "content-box");
            titulo.setAttribute("style", "cursor: pointer;");
            get(child(dbRef, 'Conteudo/')).then((snapshot) => {
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();

                    if (snapshot.exists()) {
                        if (childData.nomeConteudo == itemRef["_location"]["path_"]) {
                            titulo.innerHTML =  "Id: " + childData.idConteudo + " Nome: " + itemRef["_location"]["path_"];
                            titulo.setAttribute("id", childData.idConteudo);
                            titulo.addEventListener("click", detalhesConteudo, false);
                            titulo.setAttribute("class", "pdfDowload");
                            titulo.setAttribute("name", itemRef["_location"]["path_"]);
                            titulo.setAttribute("target", "_blank");
                            descricao.innerHTML = childData.descricao;
                            nomeAutor.innerHTML = childData.autor;
                            divPequena.appendChild(titulo);
                            divPequena.appendChild(nomeAutor);
                            divPequena.appendChild(descricao);
                            divGrande.appendChild(divPequena);
                            div.appendChild(divGrande);
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
}

if (divUsuariosAdministrador) {
    get(child(dbRef, 'Educador/')).then((snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
    
            if (snapshot.exists()) {
                let div = document.getElementById("usuariosAdministrador");
                let divGrande = document.createElement("div");
                let divPequena = document.createElement("div");
                let titulo = document.createElement("h5");
                let email = document.createElement("p");
                let tipo = document.createElement("small");
                divGrande.setAttribute("class", "col-md-4");
                divPequena.setAttribute("class", "content-box");
                titulo.innerHTML = "Id: " + childData.idEducador + " Nome: " + childData.nomeEducador;
                email.innerHTML = childData.loginEducador;
                tipo.innerHTML = "Educador";
                divPequena.appendChild(titulo);
                divPequena.appendChild(email);
                divPequena.appendChild(tipo);
                divGrande.appendChild(divPequena);
                div.appendChild(divGrande);
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
                let divGrande = document.createElement("div");
                let divPequena = document.createElement("div");
                let titulo = document.createElement("h5");
                let email = document.createElement("p");
                let tipo = document.createElement("small");
                divGrande.setAttribute("class", "col-md-4");
                divPequena.setAttribute("class", "content-box");
                titulo.innerHTML = "Id: " + childData.idEstudante + " Nome: " + childData.nomeEstudante;
                email.innerHTML = childData.loginEstudante;
                tipo.innerHTML = "Estudante";
                divPequena.appendChild(titulo);
                divPequena.appendChild(email);
                divPequena.appendChild(tipo);
                divGrande.appendChild(divPequena);
                div.appendChild(divGrande);
            } else {
                console.log("No data available");
            }
        });
    }).catch((error) => {
        console.error(error);
    });
}

$("#excluirEducador").click(function () {
    deletarEducador();
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