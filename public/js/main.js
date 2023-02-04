const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

// Get username and room from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})


const socket=io();
// Get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})


// Message from server
socket.on('message',(message)=>{
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})

// Join Room
socket.emit('joinRoom',{username,room})

// Message Submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    // Get a value of message
    const msg=e.target.elements.msg.value;

    // Firing the event
    socket.emit('chatMessage',msg);
    
    // Clearing the message box
    e.target.elements.msg.value=' ';
    e.target.elements.msg.focus();
})

// Output The messages in page
const outputMessage=(message)=>{
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML= `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.message}
    </p>`
   
    
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
const outputRoomName=(room)=>{
    roomName.innerHTML=room
}

// Add users to DOM

const outputUsers=(users)=>{
    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}`
}