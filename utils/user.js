let users=[]


// Add user
const addUser=(id,username,room)=>{
    const user= {id,username,room};
    users.push(user);
    return user;
}

// Get Current user
const currentUser=(id)=>{
    return users.find(user=>user.id===id);
}

// Get Leaved user
const leftUser=(id)=>{
    const index=users.findIndex(user=> user.id===id);
    if(index !==-1){
        return users.splice(index,1)[0];
    }
}

// Room Users
const getRoomUsers=(room)=>{
    return users.filter(user=> user.room===room)
}

module.exports={addUser,currentUser,leftUser,getRoomUsers};