import { getDatabase, ref, set, onValue, child, get, remove} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
var id = 0;

export function validarAdministrador(email) {
    const dbRef = ref(getDatabase());
    
    get(child(dbRef, 'Administrador/')).then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();

            if (snapshot.exists()) {
                if(childData.loginAdministrador == email) {
                    window.location.replace("./view/HomeAdministradorView.html");
                }
            } else {
                console.log("No data available");
            }
        });
    }).catch((error) => {
        console.error(error);
    });
}

export function pegarDatabase() {
    return ref(getDatabase());
}