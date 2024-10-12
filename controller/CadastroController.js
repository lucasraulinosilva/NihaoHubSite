import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, sendEmailVerification, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getDatabase, ref, set, onValue, child, get, remove} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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
var idEducador = 0;
var idEstudante = 0;
var idFormacao = 0;
var idArea = 0;
var database = getDatabase(app);
var dbRef = ref(database);

get(child(dbRef, 'Estudante/')).then((snapshot) => {
    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();

        idEstudante = childData.idEstudante;
    });
}).catch((error) => {
    console.error(error);
});

get(child(dbRef, 'Educador/')).then((snapshot) => {
    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();

        idEducador = childData.idEducador;
    });
}).catch((error) => {
    console.error(error);
});

get(child(dbRef, 'Formacao/')).then((snapshot) => {
    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();

        idFormacao = childData.idFormacao;
    });
}).catch((error) => {
    console.error(error);
});

get(child(dbRef, 'Area/')).then((snapshot) => {
    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();

        idArea = childData.idArea;
    });
}).catch((error) => {
    console.error(error);
});

$("#cadastro").click(function() {

    if($("input[type='radio'][name='tipoCadastro']:checked").val() == "educador") {
        var email = $("#email").val();
        var password = $("#senha").val();
        var nome = $("#nome").val();
        var area = $("#area").val();
        var formacao = $("#formacao").val();

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user);

            set(ref(database, 'Educador/' + (idEducador + 1)), {
                idEducador: idEducador + 1,
                loginEducador: email,
                nomeEducador: nome
            });

            set(ref(database, 'Area/' + (idArea + 1)), {
                idEducador: idEducador + 1, 
                idArea: idArea + 1,
                nomeArea: area
            });

            set(ref(database, 'Formacao/' + (idFormacao + 1)), {
                idEducador: idEducador + 1,
                idFormacao: idFormacao + 1,
                nomeFormacao: formacao
            });

            const toastLiveExample = document.getElementById('cadastroBemSucedido');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            if(errorMessage == "Firebase: Error (auth/email-already-in-use).") {
                const toastLiveExample2 = document.getElementById('cadastroJaExistente');
                const toastBootstrap2 = bootstrap.Toast.getOrCreateInstance(toastLiveExample2);
                toastBootstrap2.show();
            }

            console.log(errorMessage);
        });

    } else if($("input[type='radio'][name='tipoCadastro']:checked").val() == "estudante") {
        var email = $("#email").val();
        var password = $("#senha").val();
        var nome = $("#nome").val();

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            sendEmailVerification(user);

            set(ref(database, 'Estudante/' + (idEstudante + 1)), {
                idEstudante: idEstudante + 1,
                loginEstudante: email,
                nomeEstudante: nome
            });

            const toastLiveExample = document.getElementById('cadastroBemSucedido');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            
            if(errorMessage == "Firebase: Error (auth/email-already-in-use).") {
                const toastLiveExample2 = document.getElementById('cadastroJaExistente');
                const toastBootstrap2 = bootstrap.Toast.getOrCreateInstance(toastLiveExample2);
                toastBootstrap2.show();
            }

            console.log(errorMessage);
        });
    }

});
