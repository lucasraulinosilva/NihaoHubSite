import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getStorage,
    ref,
    getDownloadURL,
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
var emailEducador = "";
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
var msg;
var i = 0;
var temas = [];

setPersistence(auth, browserSessionPersistence)
.then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    emailEducador = auth.currentUser.email;
    $("#emailGeral").html(auth.currentUser.email);
    return signInWithEmailAndPassword(auth, email, password);
})
.catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
});


// Função para exibir a mensagem no chat
function addMessageToChatBox(role, message, data) {
  const messageElement = document.createElement("p");

  if (data != null) {
    for (i = 0; i < data.entities["Jorge:Jorge"].length; i++) {
      if (data.entities["Jorge:Jorge"][i].confidence >= 0.995) {
        if (data.entities["Jorge:Jorge"][0].value == "Possuo esses conteúdos:") {
          listAll(listRef)
          .then((res) => {
              res.items.forEach((itemRef) => {
                  let div = document.getElementById("chat-box");
                  let a = document.createElement("a");
                  let p = document.createElement("p");
                  a.setAttribute("class", "pdfDowload");
                  a.setAttribute("name", itemRef["_location"]["path_"]);
                  a.setAttribute("target", "_blank");
                  a.innerHTML = itemRef["_location"]["path_"]
                  get(child(dbRef, 'Conteudo/')).then((snapshot) => {
                      snapshot.forEach(function(childSnapshot) {
                          var childData = childSnapshot.val();
              
                          if (snapshot.exists()) {
                              if(childData.nomeConteudo == itemRef["_location"]["path_"]) {
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
        } else if (data.entities["Jorge:Jorge"][0].value == "Possuo esses temas:"){
          get(child(dbRef, 'Conteudo/')).then((snapshot) => {
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
    
                if (snapshot.exists()) {
                  temas.push(childData.tema);
                } else {
                    console.log("No data available");
                }
            });
            message += temas.filter(onlyUnique);
            messageElement.textContent = `${role}: ${message}`;
        }).catch((error) => {
            console.error(error);
        });
        }
        messageElement.textContent = `${role}: ${message}`;
      } else {
        messageElement.textContent = "Jorge: Não posso responder isso, tente outra pergunta.";
      }
    } 
  } else {
    messageElement.textContent = `${role}: ${message}`;
  }
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Rolagem automática para a última mensagem
}

// Função para enviar a mensagem do usuário e obter a resposta da API
async function sendMessage() {
  const userMessage = userInput.value;
  addMessageToChatBox("Você", userMessage, null);
  userInput.value = "";

  fetch("https://api.wit.ai/message?v=20241022&q=" + userMessage, {
      headers: {
        Authorization: "Bearer PRXEVKKU4CYKOPNNK4S6ODRKXM5F45I3"
      },
    })
    .then(response => response.json())
    .then(data =>

      {
        try {
          addMessageToChatBox("Jorge", data.entities["Jorge:Jorge"][0].value, data);
        } catch (error) {
          addMessageToChatBox("Jorge", "Não posso responder isso, tente outra pergunta.", null);
          console.log(error);
        }
      }

    );

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

$("#enviarMsg").click(function() {
  sendMessage();
});

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}