import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    getBlob,
    listAll
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase, set, onValue, child, get, remove} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import { pegarDatabase } from "../controller/EducadorController.js";

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
const allowedFileTypes = ["application/pdf"];
const input = document.getElementById("arquivos");
const output = document.getElementById("output");
var idEducador = 0;
var idConteudo = 0;
var emailEducador = "";
const divConteudos = document.getElementById("conteudos");
var files = "";

setPersistence(auth, browserSessionPersistence)
.then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    emailEducador = auth.currentUser.email;
    return signInWithEmailAndPassword(auth, email, password);
})
.catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
});

if(divConteudos) {
    listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {
            let div = document.getElementById("conteudos");
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
                            titulo.innerHTML =  itemRef["_location"]["path_"];
                            titulo.setAttribute("id", childData.idConteudo);
                            titulo.addEventListener("click", detalhesConteudo, false);
                            titulo.setAttribute("class", "pdfDowload");
                            titulo.setAttribute("name", itemRef["_location"]["path_"]);
                            titulo.setAttribute("target", "_blank");
                            descricao.innerHTML = childData['descricao'].substring(0,100) + "...";
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

if(input != null) {

    get(child(dbRef, 'Educador/')).then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();

            if (snapshot.exists()) {
                if(childData.loginEducador == emailEducador) {
                    idEducador = childData.idEducador;
                    $("#emailGeral").html("Bem-vindo, Educador "+childData.nomeEducador+" !");
                }
            } else {
                console.log("No data available");
            }
        });
    }).catch((error) => {
        console.error(error);
    });

    get(child(dbRef, 'Conteudo/')).then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();

            if (snapshot.exists()) {
                idConteudo = childData.idConteudo;
            } else {
                console.log("No data available");
            }
        });
    }).catch((error) => {
        console.error(error);
    });

    input.addEventListener("change", (event) => {
        files = event.target.files;
        if (files.length === 0) {
          output.innerText = "escolha arquivos pdfs…";
          return;
        }
      
        const allAllowed = Array.from(files).every((file) =>
          allowedFileTypes.includes(file.type),
        );
        
        if(allAllowed) {
          output.innerText = "Arquivos corretos!";
          console.log(files);
        } else {
          output.innerText = "Por favor escolha apenas pdfs.";
        }
      
      });

      $("#enviarArquivo").click(function() {
        const storageRef = ref(storage, '/' + files[0].name);
        uploadBytes(storageRef, files[0]).then((snapshot) => {
            var autor = $("#autor").val();
            var descricao = $("#descricao").val();
            var tema = $("#tema").val();
            const database = getDatabase(app);
    
            set(child(dbRef, 'Conteudo/' + (idConteudo + 1)), {
                autor: autor,
                descricao: descricao,
                idConteudo: (idConteudo + 1),
                idEducador: idEducador,
                nomeConteudo: files[0].name,
                tema: tema
            });

            const toastLiveExample9 = document.getElementById('conteudoCadastrado');
            const toastBootstrap9 = bootstrap.Toast.getOrCreateInstance(toastLiveExample9);
            toastBootstrap9.show();
          });
      });
} else {
    get(child(dbRef, 'Estudante/')).then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();

            if (snapshot.exists()) {
                if(childData.loginEstudante == emailEducador) {
                    $("#emailGeral").html("Bem-vindo, Estudante "+childData.nomeEstudante+" !");
                }
            } else {
                console.log("No data available");
            }
        });
    }).catch((error) => {
        console.error(error);
    });
}

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

export function deletarConteudo() {
    var userId = $("#valorExcluirConteudo").val();
    var singleRef = child(dbRef, 'Conteudo/' + userId);

    remove(singleRef).then(function () {}).catch(function (error) {});

}