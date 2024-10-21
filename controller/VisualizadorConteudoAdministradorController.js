import {
    getDatabase,
    child,
    get,
    ref,
    set,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

var i = 0;
var param_name = "";
var dbRef = ref(getDatabase());
var nomeComentarista = "";
var idComentario = 0;
var idAvaliacao = 0;
var idAvaliacaoMudar = 0;
var numeroLikes = 0;
var numeroDislikes = 0;
var tipoAvaliacao = "";
var database = getDatabase();
var found = false;
var auth = getAuth();

//NÃO MUDA NADA
function atualizarLikes() {
    get(child(dbRef, 'Avaliacao/')).then((snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            if (childData.idConteudo == id) {
                if (childData.avaliacao == "true") {
                    numeroLikes++;
                } else if (childData.avaliacao == "false") {
                    numeroDislikes++;
                }
            }
            if (childData.idConteudo == id && childData.nomeAutorComentario == nomeComentarista) {
                if (childData.avaliacao == "true") {
                    $("#like").attr("style", "background-color: #ADE8F4; width: 30px; cursor: pointer;");
                    $("#dislike").attr("style", "background-color: white; width: 30px; cursor: pointer;");
                } else if (childData.avaliacao == "false") {
                    $("#dislike").attr("style", "background-color: #E5383B; width: 30px; cursor: pointer;");
                    $("#like").attr("style", "background-color: white; width: 30px; cursor: pointer;");
                } else {
                    $("#dislike").attr("style", "background-color: white; width: 30px; cursor: pointer;");
                    $("#like").attr("style", "background-color: white; width: 30px; cursor: pointer;");
                }
            }
            idAvaliacao = childData.idAvaliacao;
        });
        $("#numeroLikes").html(numeroLikes);
        $("#numeroDislikes").html(numeroDislikes);
        numeroLikes = 0;
        numeroDislikes = 0;
        found = false;
    }).catch((error) => {
        console.error(error);
    });
}

setPersistence(auth, browserSessionPersistence)
    .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        get(child(dbRef, 'Estudante/')).then((snapshot) => {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.loginEstudante == auth.currentUser.email) {
                    nomeComentarista = childData.nomeEstudante;
                }
            });
        }).catch((error) => {
            console.error(error);
        });

        get(child(dbRef, 'Educador/')).then((snapshot) => {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                if (childData.loginEducador == auth.currentUser.email) {
                    nomeComentarista = childData.nomeEducador;
                }
            });
        }).catch((error) => {
            console.error(error);
        });

        atualizarLikes();

        return signInWithEmailAndPassword(auth, email, password);
    })
    .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
    });

// função pra ler querystring
function queryString(parameter) {
    var loc = location.search.substring(1, location.search.length);
    var param_value = false;
    var params = loc.split("&");
    for (i = 0; i < params.length; i++) {
        param_name = params[i].substring(0, params[i].indexOf('='));
        if (param_name == parameter) {
            param_value = params[i].substring(params[i].indexOf('=') + 1)
        }
    }
    if (param_value) {
        return param_value;
    } else {
        return undefined;
    }
}

var variavel = queryString("url");
var id = parseInt(queryString("id"));

get(child(dbRef, 'Conteudo/')).then((snapshot) => {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        if (childData.idConteudo == id) {
            $("#nomeConteudoEscolhido").html("Nome: " + childData.nomeConteudo);
            $("#temaConteudoEscolhido").html("Tema: " + childData.tema);
            $("#autorConteudoEscolhido").html("Autor: " + childData.autor);
            $("#descricaoConteudoEscolhido").html("Descrição: " + childData.descricao);
        }
    });
}).catch((error) => {
    console.error(error);
});

function lerComentarios() {
    let listaComentarios = document.getElementById("comentariosConteudo");
    while (listaComentarios.children.length > 0) {
        listaComentarios.removeChild(listaComentarios.children[0]);
    }
    get(child(dbRef, 'Comentario/')).then((snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            if (childData.idConteudo == id) {
                let li = document.createElement("li");
                li.innerHTML = "Id comentário: " + childData.idComentario + " Nome: " + childData.nomeAutorComentario + " Comentário: " + childData.comentario;
                listaComentarios.appendChild(li);
            }
            idComentario = childData.idComentario;
        });
    }).catch((error) => {
        console.error(error);
    });
}

lerComentarios();

$("#retirarComentarioUsuario").click(function () {
    var valorIdComentario = $("#retirarComentario").val();
    if (valorIdComentario >= 0) {
        var referencia =  ref(database, 'Comentario/' + valorIdComentario);

        remove(referencia).then(function() {
            lerComentarios();
        }).catch(function(error) {
        });
    }
});

$("#dowloadConteudo").attr("href", variavel);
$("#iframe").attr("src", "https://docs.google.com/viewer?url=" + variavel + "&embedded=true")

var cover = document.createElement("div");
cover.setAttribute("id", "filtro");
let css = `
            position: absolute;
            pointer-events: none;
            top: 0;
            left: 0;
            width: 600px;
            height: 780px;
            background-color: #EDEDE9;
            mix-blend-mode: difference;
            z-index: 1;
        `
cover.setAttribute("style", css);
let itens = document.getElementById("itens")
itens.appendChild(cover);

$("#filtro").hide();

$("#modo").click(function () {
    if ($("#filtro").is(":visible")) {
        $("#filtro").hide();
    } else {
        $("#filtro").show();
    }
})

console.log("kk");
