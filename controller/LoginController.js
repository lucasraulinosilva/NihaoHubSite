import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { validarEducador } from "./EducadorController.js";
import { validarEstudante } from "./EstudanteController.js";

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

$("#login").click(function(){
    var email = $("#emailLogin").val();
    var password = $("#passwordLogin").val();

    const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if(userCredential.user.emailVerified == true) {
                $("#formLogin").hide();
                $("#carregar").show();
                validarEducador(userCredential.user.email);
                validarEstudante(userCredential.user.email);
            } else {
                const toastLiveExample2 = document.getElementById('naoVerificado');
                const toastBootstrap2= bootstrap.Toast.getOrCreateInstance(toastLiveExample2);
                toastBootstrap2.show();
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);

            if(errorMessage == "Firebase: Error (auth/invalid-credential).") {
                const toastLiveExample = document.getElementById('loginErrado');
                const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                toastBootstrap.show();
            }
        });
});
$("#carregar").hide();