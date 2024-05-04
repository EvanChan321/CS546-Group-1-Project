import { userData } from "./index.js";

function compare(a, b) {
    if (a.numOfPoints > b.numOfPoints) {
        return -1;
    } else if (a.numOfPoints < b.numOfPoints) {
        return 1;
    } else {
        if (a.userId < b.userId) {
            return -1;
        } else if (a.userId > b.userId) {
            return 1;
        } else {
            return 0;
        }
    }
}

const calculateLeaderBoard = async () => {
    const users = await userData.getAllUsers();
    let defaultUsers = users.filter(function (user) {
        return user.accountType === "Default";
    });
    defaultUsers = defaultUsers.sort(compare);
    defaultUsers = defaultUsers.map((user, index) => {
        return { ...user, position: index + 1 };
    });

    for (const user of defaultUsers) {
        if (user.numOfPoints === 0) {
            user.tier = "Boba Fool";
        } else if (user.numOfPoints < 50 && user.numOfPoints > 0) {
            user.tier = "Boba Learner";
        } else if (user.numOfPoints < 150 && user.numOfPoints >= 50) {
            user.tier = "Boba Novice";
        } else if (user.numOfPoints < 300 && user.numOfPoints >= 150) {
            user.tier = "Boba Lover";
        } else if (user.numOfPoints < 500 && user.numOfPoints >= 300) {
            user.tier = "Boba Soldier";
        } else if (user.numOfPoints < 750 && user.numOfPoints >= 500) {
            user.tier = "Boba Warrior";
        } else if (user.numOfPoints < 1000 && user.numOfPoints >= 750) {
            user.tier = "Boba Monster";
        } else if (user.numOfPoints < 1500 && user.numOfPoints >= 1000) {
            user.tier = "Boba King";
        } else {
            user.tier = "Boba Deity";
        }
    }
    return defaultUsers;
};

const exportedMethods = {
    calculateLeaderBoard
};
export default exportedMethods;
