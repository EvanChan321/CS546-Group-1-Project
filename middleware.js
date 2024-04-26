/*
You can choose to define all your middleware functions here, 
export them and then import them into your app.js and attach them that that.
add.use(myMiddleWare()). you can also just define them in the app.js if you like as seen in lecture 10's lecture code example. If you choose to write them in the app.js, you do not have to use this file. 
*/
import { shopData, userData } from "./data/index.js";

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
        if(req.originalUrl !== '/user/login' && req.originalUrl !== '/user/signup' && req.method === "GET"){
            if (!req.session.user) {
                return res.redirect('/user/login');
            }
            else{
                const urlSegments = req.originalUrl.split('/');
                const id = urlSegments[2]; 
                if(req.session.user.id !== id && req.session.user.accountType !== "Admin"){
                    return res.status(403).render("error", {
                        error: "Not Authorized"})
                } 
            }
        }
        next()
    }
}

export const addShop = (routes) => {
    return (req, res, next) => {
        if(req.method === "POST"){
            if (!req.session.user) {
                return res.status(403).render("error", {
                    error: "Not Authorized"})
            }
        }
        next()
    }
}

export const deleteShop = (routes) => {
    return async (req, res, next) => {
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = await shopData.getShop(id)
            if (!req.session.user || (req.session.user.accountType !== "Admin" && req.session.user.id !== shop.ownerId)) {
                return res.status(403).render("error", {
                    error: "Not Authorized"})
            }
        }
        next()
    }
}

export const deleteFlag = (routes) => {
    return async (req, res, next) => {
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = await shopData.getShop(id)
            if (!req.session.user || req.session.user.accountType !== "Admin") {
                return res.status(403).render("error", {
                    error: "Not Authorized"})
            }
        }
        next()
    }
}

export const reviewShop = (routes) => {
    return async (req, res, next) => {
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
                    return res.status(403).render('error', { error: 'Cant Review Twice' });
                }
            }
            if (!req.session.user || req.session.user.accountType !== "Default" || req.session.user.id === shop.ownerId) {
                return res.status(403).render('error', { error: 'Unauthorized Access' });
            }
        }
        next()
    }
}

export const flagShop = (routes) => {
    return async (req, res, next) => {
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
                return res.status(403).render('error', { error: 'Cant Flag Twice' });
            }
            if (!req.session.user || req.session.user.accountType !== "Default" || req.session.user.id === shop.ownerId) {
                return res.status(403).render('error', { error: 'Unauthorized Access' });
            }
        }
        if(req.method === "POST"){
            if(double){
                return res.status(403).render('error', { error: 'Cant Flag Twice' });
            }
            if (!req.session.user || req.session.user.accountType !== "Default" || req.session.user.id === shop.ownerId) {
                return res.status(403).render('error', { error: 'Unauthorized Access' });
            }
        }
        next()
    }
}


export const itemForm = (routes) => {
    return async (req, res, next) => {
        if(req.method === "POST"){
            const urlSegments = req.originalUrl.split('/');
            const id = urlSegments[2];
            const shop = await shopData.getShop(id)            
            if(shop.ownerId !== ""){
                if (!req.session.user || req.session.user.id !== shop.ownerId) {
                    return res.status(403).render("error", {
                        error: "Not Authorized"})
                }
            }
            else{
                if (!req.session.user || req.session.user.accountType === "Buisness") {
                    return res.status(403).render("error", {
                        error: "Not Authorized"})
                }
            }
        }
        next()
    }
}