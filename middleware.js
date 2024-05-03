/*
You can choose to define all your middleware functions here, 
export them and then import them into your app.js and attach them that that.
add.use(myMiddleWare()). you can also just define them in the app.js if you like as seen in lecture 10's lecture code example. If you choose to write them in the app.js, you do not have to use this file. 
*/
import { flagData, itemData, shopData, userData } from "./data/index.js";

export const loginData = (routes) => {
    return (req, res, next) => {
        if(req.method === "GET"){
            if (req.session.user) {
                if (req.originalUrl === '/user/login' || req.originalUrl === '/user/signup') {
                    return res.redirect(`/user/${req.session.user.id}`);
                }
            }
        }
        next()
    }
}

export const userLogin = (routes) => {
    return (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.originalUrl !== '/user/login' && req.originalUrl !== '/user/signup' && req.method === "GET" && req.originalUrl !== '/user/signup/business'){
            if (!req.session.user) {
                return res.redirect('/user/login');
            }
            // else{
            //     const urlSegments = req.originalUrl.split('/');
            //     const id = urlSegments[2]; 
            //     if(req.session.user.id !== id && req.session.user.accountType !== "Admin"){
            //         return res.status(403).render("error", {
            //             title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user
            //         })
            //     } 
            // }
        }
        next()
    }
}

export const deleteUser = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const user = await userData.getUser(id)   
            if (!req.session.user || (req.session.user.id !== id && req.session.user.accountType !== "Admin")) {
                return res.status(403).render("error", {
                    title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
            }         
        }
        next()
    }
}

export const addShop = (routes) => {
    return (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST" || req.method === "GET"){
            if (!req.session.user) {
                return res.status(403).render("error", {
                    title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
            }
        }
        next()
    }
}

export const deleteShop = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = await shopData.getShop(id)
            if (!req.session.user || (req.session.user.accountType !== "Admin" && req.session.user.id !== shop.ownerId)) {
                return res.status(403).render("error", {
                    title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
            }
        }
        next()
    }
}

export const claimShop = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = await shopData.getShop(id)
            if (!req.session.user || req.session.user.accountType !== "Business" || shop.ownerId !== "" ) {
                return res.status(403).render("error", {
                    title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
            }
        }
        next()
    }
}

export const seeFlag = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "GET"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[4];
            const flag = await flagData.getFlag(id)
            if (!req.session.user || (req.session.user.accountType !== "Admin" && req.session.user.id !== flag.userId)) {
                return res.status(403).render("error", {
                    title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
            }
        }
        next()
    }
}

export const deleteFlag = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST" || req.method === "GET"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = await shopData.getShop(id)
            if (!req.session.user || req.session.user.accountType !== "Admin") {
                return res.status(403).render("error", {
                    title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
            }
        }
        next()
    }
}

export const reviewShop = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = await shopData.getShop(id)
            let double = false
            if(req.session.user){
                const user = await userData.getUser(req.session.user.id)
                user.reviews.forEach((review) => {
                    if(review.objId.toString() === id){
                        double = true
                    }
                })
                if(double){
                    return res.status(403).render('error', { title: "Error", error: 'Cant Review Twice', themeType: themeType, loggedIn: req.session.user });
                }
            }
            if (!req.session.user || req.session.user.accountType !== "Default" || req.session.user.id === shop.ownerId) {
                return res.status(403).render('error', { title: "Error", error: 'Unauthorized Access', themeType: themeType, loggedIn: req.session.user });
            }
        }
        next()
    }
}

export const reviewItem = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const shopid = urlSegments[2];
            const id = urlSegments[4];
            const shop = await shopData.get(shopid)
            let double = false
            if(req.session.user){
                const user = await userData.getUser(req.session.user.id)
                user.reviews.forEach((review) => {
                    if(review.objId.toString() === id){
                        double = true
                    }
                })
                if(double){
                    return res.status(403).render('error', { title: "Error", error: 'Cant Review Twice', themeType: themeType, loggedIn: req.session.user });
                }
            }
            if (!req.session.user || req.session.user.accountType !== "Default" || req.session.user.id === shop.ownerId) {
                return res.status(403).render('error', { title: "Error", error: 'Unauthorized Access', themeType: themeType, loggedIn: req.session.user });
            }
        }
        next()
    }
}

export const flagShop = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        const urlSegments = req.originalUrl.split('/');
        const id = urlSegments[2];
        const shop = await shopData.getShop(id)
        let double = false
        if(req.session.user){
            shop.flags.forEach((flag) => {
                if(flag.userId === req.session.user.id){
                    double = true
                }
            })
        }  
        if(req.method === "GET"){
            if(double){
                return res.status(403).render('error', { title: "Error", error: 'Cant Flag Twice', themeType: themeType, loggedIn: req.session.user });
            }
            if (!req.session.user || req.session.user.accountType !== "Default" || req.session.user.id === shop.ownerId) {
                return res.status(403).render('error', { title: "Error", error: 'Unauthorized Access', themeType: themeType, loggedIn: req.session.user });
            }
        }
        if(req.method === "POST"){
            if(double){
                return res.status(403).render('error', { title: "Error", error: 'Cant Flag Twice', loggedIn: req.session.user, themeType: themeType });
            }
            if (!req.session.user || req.session.user.accountType !== "Default" || req.session.user.id === shop.ownerId) {
                return res.status(403).render('error', { title: "Error", error: 'Unauthorized Access', themeType: themeType, loggedIn: req.session.user });
            }
        }
        next()
    }
}


export const itemForm = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST" || req.method === "GET"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = await shopData.getShop(id)            
            if(shop.ownerId !== ""){
                if (!req.session.user || (req.session.user.id !== shop.ownerId && req.session.user.accountType !== "Admin")) {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
                }
            }
            else{
                if (!req.session.user || req.session.user.accountType === "Business") {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
                }
            }
        }
        next()
    }
}

export const leaveComment = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            if (!req.session.user || req.session.user.accountType !== "Default") {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
            }
        }
        next()
    }
}

export const editReview = (routes) => {
    return async (req, res, next) => {
        const urlSegments = req.originalUrl.split('/');
        if(req.originalUrl === 3){
            console.log(1)
            const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
            if(req.method === "POST"){
                const id = urlSegments[2];
                if (!req.session.user) {
                        return res.status(403).render("error", {
                            title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
                }
                else{
                    const user = await userData.getUser(req.session.user.id)
                    let isOwner = false
                    user.reviews.forEach((userReview) => {
                        if(userReview._id.toString() === id){
                            isOwner = true
                        }
                    })
                    if (!isOwner) {
                        return res.status(403).render("error", {
                            title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
                    }
                }
            }
        }
        next()
    }
}

export const deleteReview = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            if (!req.session.user) {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
            }
            else{
                const user = await userData.getUser(req.session.user.id)
                let isOwner = false
                user.reviews.forEach((userReview) => {
                    if(userReview._id.toString() === id){
                        isOwner = true
                    }
                })
                if (!isOwner && req.session.user.accountType !== "Admin") {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
                }
            }
        }
        next()
    }
}

export const deleteComment = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[4];
            if (!req.session.user) {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", loggedIn: req.session.user, themeType: themeType})
            }
            else{
                const user = await userData.getUser(req.session.user.id)
                let isOwner = false
                user.comments.forEach((userReview) => {
                    if(userReview.toString() === id){
                        isOwner = true
                    }
                })
                if (!isOwner && req.session.user.accountType !== "Admin") {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
                }
            }
        }
        next()
    }
}

export const editShop = (routes) => {
    return async (req, res, next) => {
        const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = shopData.getShop(id)
            if (!req.session.user) {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", loggedIn: req.session.user, themeType: themeType})
            }
            else{
                let isOwner = false
                if(shop.ownerId){
                    if(shop.ownerId === req.session.user.id){
                        isOwner = true
                    }
                }
                else{
                    isOwner = true
                }
                if (!isOwner && req.session.user.accountType !== "Admin") {
                    return res.status(403).render("error", {
                        title: "Error", error: "Not Authorized", themeType: themeType, loggedIn: req.session.user})
                }
            }
        }
        next()
    }
}