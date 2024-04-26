import { userData } from "./index.js";

function compare( a, b ) {
    if ( a.numOfLikes < b.numOfLikes ){
      return -1;
    }
    else if ( a.numOfLikes > b.numOfLikes ){
      return 1;
    }
    else{
        return 0
    }
  }


const calculateLeaderBoard = async () => {
    const users = await userData.getAllUsers()
    let defaultUsers = users.filter(function (user) {
        return (user.accountType === "Default")
    })
    defaultUsers = defaultUsers.sort(compare)
    defaultUsers = defaultUsers.map((user, index) => {
      return { ...user, position: index+1 };
    })
    return defaultUsers
}

const exportedMethods = {
    calculateLeaderBoard
}
export default exportedMethods;