const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Função para exibir a mensagem no chat
function addMessageToChatBox(role, message, data) {
  const messageElement = document.createElement("p");

  if (data != null) {
    for (i = 0; i < data.entities["Jorge:Jorge"].length; i++) {
      if (data.entities["Jorge:Jorge"][i].confidence >= 0.995) {
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
        }
      }

    );

}