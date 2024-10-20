import {
    getDatabase,
    child,
    get,
    ref,
    set,
    update
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

get(child(dbRef, 'Comentario/')).then((snapshot) => {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        if (childData.idConteudo == id) {
            let listaComentarios = document.getElementById("comentariosConteudo");
            let li = document.createElement("li");
            li.innerHTML = "Nome: " + childData.nomeAutorComentario + " Comentário: " + childData.comentario;
            listaComentarios.appendChild(li);
        }
        idComentario = childData.idComentario;
    });
}).catch((error) => {
    console.error(error);
});

$("#comentar").click(function () {
    var valorComentario = $("#inserirComentario").val();

    set(ref(database, 'Comentario/' + (idComentario + 1)), {
        nomeAutorComentario: nomeComentarista,
        idConteudo: id,
        idComentario: (idComentario + 1),
        comentario: valorComentario
    });
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

//NÃO MUDA NADA
$("#like").click(function () {
    $(this).attr("style", "background-color: #ADE8F4; width: 30px; cursor: pointer;");
    $("#dislike").attr("style", "background-color: white; width: 30px; cursor: pointer;");
    get(child(dbRef, 'Avaliacao/')).then((snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            if (childData.idConteudo == id && childData.nomeAutorComentario == nomeComentarista && (childData.avaliacao == "false" || childData.avaliacao == "") && found == false) {
                tipoAvaliacao = "mudarTrue";
                idAvaliacaoMudar = childData.idAvaliacao;
                found = true;
            } else if(childData.idConteudo == id && childData.nomeAutorComentario == nomeComentarista && childData.avaliacao == "true" && found == false){
                tipoAvaliacao = "nenhuma";
                idAvaliacaoMudar = childData.idAvaliacao;
                found = true;
            } else if (childData.idConteudo == id && childData.nomeAutorComentario != nomeComentarista && found == false) {
                tipoAvaliacao = "naoExiste";
            } else if (childData.idConteudo != id && childData.nomeAutorComentario != nomeComentarista && found == false) {
                tipoAvaliacao = "naoExiste";
            }
        });
        if (tipoAvaliacao == "naoExiste") {
            set(ref(database, 'Avaliacao/' + (idAvaliacao + 1)), {
                nomeAutorComentario: nomeComentarista,
                idConteudo: id,
                idAvaliacao: (idAvaliacao + 1),
                avaliacao: "true"
            });
        }
        if (tipoAvaliacao == "mudarTrue") {
            update(ref(database, 'Avaliacao/' + idAvaliacaoMudar + "/"), {
                nomeAutorComentario: nomeComentarista,
                idConteudo: id,
                idAvaliacao: idAvaliacaoMudar,
                avaliacao: "true"
            });
        }
        if (tipoAvaliacao == "nenhuma") {
            update(ref(database, 'Avaliacao/' + idAvaliacaoMudar + "/"), {
                nomeAutorComentario: nomeComentarista,
                idConteudo: id,
                idAvaliacao: idAvaliacaoMudar,
                avaliacao: ""
            });
        }
        $("#numeroLikes").html(numeroLikes);
        $("#numeroDislikes").html(numeroDislikes);
        atualizarLikes();
    }).catch((error) => {
        console.error(error);
    });
});

//NÃO MUDA NADA
$("#dislike").click(function () {
    $(this).attr("style", "background-color: #E5383B; width: 30px; cursor: pointer;");
    $("#like").attr("style", "background-color: white; width: 30px; cursor: pointer;");
    get(child(dbRef, 'Avaliacao/')).then((snapshot) => {
        snapshot.forEach(function (childSnapshot) {
            var childData = childSnapshot.val();
            if (childData.idConteudo == id && childData.nomeAutorComentario == nomeComentarista && (childData.avaliacao == "true" || childData.avaliacao == "") && found == false) {
                tipoAvaliacao = "mudarFalse";
                idAvaliacaoMudar = childData.idAvaliacao;
                found = true;
            } else if (childData.idConteudo == id && childData.nomeAutorComentario == nomeComentarista && childData.avaliacao == "" && found == false) {
                tipoAvaliacao = "mudarFalse";
                idAvaliacaoMudar = childData.idAvaliacao;
                found = true;
            }
            else if(childData.idConteudo == id && childData.nomeAutorComentario == nomeComentarista && childData.avaliacao == "false" && found == false){
                tipoAvaliacao = "nenhuma";
                idAvaliacaoMudar = childData.idAvaliacao;
                found = true;
            } else if (childData.idConteudo == id && childData.nomeAutorComentario != nomeComentarista && found == false) {
                tipoAvaliacao = "naoExiste";
            } else if (childData.idConteudo != id && childData.nomeAutorComentario != nomeComentarista && found == false) {
                tipoAvaliacao = "naoExiste";
            }
        });
        if (tipoAvaliacao == "naoExiste") {
            set(ref(database, 'Avaliacao/' + (idAvaliacao + 1)), {
                nomeAutorComentario: nomeComentarista,
                idConteudo: id,
                idAvaliacao: (idAvaliacao + 1),
                avaliacao: "false"
            });
        }
        if (tipoAvaliacao == "mudarFalse") {
            update(ref(database, 'Avaliacao/' + idAvaliacaoMudar + "/"), {
                nomeAutorComentario: nomeComentarista,
                idConteudo: id,
                idAvaliacao: idAvaliacaoMudar,
                avaliacao: "false"
            });
        }
        if (tipoAvaliacao == "nenhuma") {
            update(ref(database, 'Avaliacao/' + idAvaliacaoMudar + "/"), {
                nomeAutorComentario: nomeComentarista,
                idConteudo: id,
                idAvaliacao: idAvaliacaoMudar,
                avaliacao: ""
            });
        }
        $("#numeroLikes").html(numeroLikes);
        $("#numeroDislikes").html(numeroDislikes);
        atualizarLikes();
    }).catch((error) => {
        console.error(error);
    });
});

console.log("j");
