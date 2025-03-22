const chatBody = document.querySelector(".chat_body");
const messageInput = document.querySelector(".message_input");

const sendInput = document.querySelector("#send_message")

const fileInput = document.getElementById("file_input");
const fileUpload = document.getElementById("file_upload");

const emojiButton = document.getElementById("emoji_button");
const emojiPicker = document.getElementById("emoji_picker");

const apiKey = "AIzaSyDVVC7u6B1rfD318HEezb_l9LdR44QHhLk";
const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type:null
    }
}

// fetching Gemini response and returning response
async function fetchGeminiResponse(userMessage) {
    const requestData = {     //think of this like sending a letter: CONTENTS->the envelop, PARTS->the pages inside, TEXT->the actual message
        contents: [{parts : [{text : userMessage}, ...(userData.file.data ? [{ inline_data: userData.file }] :[])]
     }]
    };
    try {       
         //AWAIT waits for the API to respond before moving on.
        const response = await fetch(apiURL, {  //fetch is used to send data to the API using a network request. 
            method: "POST",       //means you are sending data ,not just reading it.
            headers: {"Content-Type" : "application/json"}, //describes the type of data we are sending - for this JSON
            body: JSON.stringify(requestData)   //converts my requestData object into JSON format.
        });
        if (!response.ok) throw new Error("API Error: "+ response.statusText);
        const data = await response.json();

        // Extract and return response text
        return data?.candidates?.[0]?.content?.parts?.[0].text || "Sorry, I couldn't understand that.🤔";
    } catch (error) {
        console.error("Error fetching respone: ",error);
        return "Oops! Something went wrong. Please try agian.";
    }
   
    
}

// To get the message from the input and append it to the chatBody
function appendMessage(text,isUser = true) {
    const messageDiv = document.createElement("div"); //adding new div to body
    messageDiv.classList.add("message"); //giving the new body class message

    if (isUser) {                               //checking if the message is from user or bot
        messageDiv.classList.add("user_message");
    }else{
        messageDiv.classList.add("bot_message");
    }

    const messageText = document.createElement("div");  //adding a new div inside the messageDiv 
    messageText.classList.add("message_text");  //giving it the class message_text
    messageText.innerHTML = text;   //taking the text from the input and pasting it in the user message_text

    messageDiv.appendChild(messageText);    // msgtxt is added to parent class ie msgDiv
    chatBody.appendChild(messageDiv);   //msgDiv is added to parent class ie chatBody
    chatBody.scrollTop = chatBody.scrollHeight; //so that when new msg is entered it shows the newly entered msg
}


function botThinking(){


    const botMessage = document.createElement("div");
    botMessage.classList.add("message","bot_message","thinking");

    const botLogo = document.createElement("svg");
    botLogo.innerHTML = `<svg class="chatbot_logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
            </svg>`; 

    const messageText = document.createElement("div");
    messageText.classList.add("message_text")

    const thinkingIndicator = document.createElement("div");
    thinkingIndicator.classList.add("thinking_indicator");
    for (let i = 0 ; i<3 ; i++){
        const dot = document.createElement("div");
        dot.classList.add("dot");
        thinkingIndicator.appendChild(dot);
    }

    messageText.appendChild(thinkingIndicator);
    botMessage.appendChild(botLogo);
    botMessage.appendChild(messageText);
    chatBody.appendChild(botMessage);

    chatBody.scrollTop = chatBody.scrollHeight;
}

 async function showBotResponse(userMessage){
        botThinking();

        const responseText = await fetchGeminiResponse(userMessage);

        const thinkingMessage = document.querySelector(".thinking");
        if (thinkingMessage) thinkingMessage.remove();

        const botMessage = document.createElement("div");
        botMessage.classList.add("message","bot_message");

        const botLogo = document.createElement("svg");
        botLogo.innerHTML = `<svg class="chatbot_logo" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
                    <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"></path>
                </svg>`;    

        const messageText = document.createElement("div");
        messageText.classList.add("message_text");

        //convert markdown to html
        const convertedHTML = marked.parse(responseText);
        messageText.innerHTML = convertedHTML;

        botMessage.appendChild(botLogo);
        botMessage.appendChild(messageText);
        chatBody.appendChild(botMessage);

        chatBody.scrollTop = chatBody.scrollHeight;
        

}


messageInput.addEventListener("keydown", (e)=>{
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && !e.shiftKey) { // Enter without Shift
        e.preventDefault(); // Prevents the cursor from going to the next line
        if (userMessage) {
            appendMessage(userMessage); // Append message to body
            messageInput.value = ""; // Clear input after sending

            showBotResponse(userMessage);
        }
    }
});
sendInput.addEventListener("click", (e)=>{
    e.preventDefault();
    const userMessage = messageInput.value.trim();
    if (userMessage) {
        appendMessage(userMessage);
        messageInput.value="";

        showBotResponse(userMessage);
    }
})

fileInput.addEventListener("change", (event) => {
    const file = fileInput.files[0];

    //validate file type
    if(!file || !(file.type.startsWith("image/"))){
        console.error("please select a valid image file.");
        return;
    }
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onload=(e)=>{

        
        const base64image = e.target.result;
        userData.file= {
            data:base64image.split(",")[1],
            mime_type:file.type
        }

        const imgTag = `<img src="${base64image}" alt="UploadImg" class="chat_image" />`;
        appendMessage(imgTag);

        fileInput.value = "";        
        
    }
    reader.readAsDataURL(file)
    
})

fileUpload.addEventListener("click",()=>{
    fileInput.click();
})


document.addEventListener("DOMContentLoaded", function() {
    const emojiButton = document.getElementById("emoji_picker");
    const pickerButton = document.getElementById("emoji_button"); // Ensure correct ID
    const inputField = document.querySelector(".message_input");
  
    // Check if EmojiMart is available
    if (typeof EmojiMart !== "undefined") {
        const picker = new EmojiMart.Picker({
            set: "apple",
            onEmojiSelect: (emoji) => {
              const inputField = document.querySelector(".message_input");
              inputField.value += emoji.native; // Append emoji to input
            },
            theme: "light",
            perLine: 8,
            emojiSize: 32,
          });
          
          // Append emoji picker
          emojiButton.appendChild(picker);
          
          // Toggle visibility when clicking the button
          pickerButton.addEventListener("click", function () {
            emojiButton.style.display = emojiButton.style.display === "block" ? "none" : "block";
          });
  }});
  
  