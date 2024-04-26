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
    return defaultUsers.sort(compare);
}

const exportedMethods = {
    calculateLeaderBoard
}
export default exportedMethods;