/*
You can choose to define all your middleware functions here, 
export them and then import them into your app.js and attach them that that.
add.use(myMiddleWare()). you can also just define them in the app.js if you like as seen in lecture 10's lecture code example. If you choose to write them in the app.js, you do not have to use this file. 
*/
/*export const logData = (routes) => {
    return (req, res, next) => {
        console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${req.session.user ? 'Authenticated User' : 'Non-Authenticated User'})`);
        if(req.method === "GET" && req.originalUrl === '/'){
            if (req.session.user && req.session.user.role === 'admin') {
                return res.redirect('/admin');
            }
            else if (req.session.user && req.session.user.role === 'user') {
                return res.redirect('/user');
            }
            else {
                return res.redirect('/login');
            }
        }
        next()
    }
}*/

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
        }
        next()
    }
}

/*export const adminLogin = (routes) => {
    return (req, res, next) => {
        if(req.method === "GET"){
            if (!req.session.user) {
                return res.redirect('/login');
            }
            else if (req.session.user && req.session.user.role !== 'admin') {
                return res.status(403).render("error", {
                error: "Not Authorized"})
            }
        }
        next()
    }
}*/
