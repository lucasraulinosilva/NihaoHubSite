import { getDatabase, ref, child, get, remove} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";


export function validarEstudante(email) {
    const dbRef = ref(getDatabase());
    
    get(child(dbRef, 'Estudante/')).then((snapshot) => {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();

            if (snapshot.exists()) {
                if(childData.loginEstudante == email) {
                    window.location.replace("./view/HomeEstudanteView.html");
                }
            } else {
                console.log("No data available");
            }
        });
    }).catch((error) => {
        console.error(error);
    });
}

export function deletarEstudante() {
    const database = getDatabase();
    var userId = $("#valorExcluirEstudante").val();
    var singleRef = ref(database, 'Estudante/' + userId);

    remove(singleRef).then(function () {}).catch(function (error) {});

}