function toggleContent(contentId) {
    const content = document.getElementById(contentId);
    if (content.style.display === 'block') {
        content.style.display = 'none';
    } else {
        content.style.display = 'block';
    }
}

function swapContent(contentId1,contentId2) {
    const content1 = document.getElementById(contentId1);
    const content2 = document.getElementById(contentId2);
    if (content1.style.display === 'block') {
        content1.style.display = 'none';
        content2.style.display = 'block';
    } else {
        content1.style.display = 'block';
        content2.style.display = 'none';
    }
}

function stringCheck (val) {
    if (typeof(val) !== 'string'){
        throw (`${val} is not a string`);
    }
}

function atLeast (val, checkVal) {
    if(val.length < checkVal){
        throw (`${val} has less than 2 elements`);
    }
};

function stringValidate (val){
    stringCheck(val)
    val = val.trim()
    atLeast(val, 1)
    return val
}

function passwordCheck (val){
    val = stringValidate(val)
    if (/\s/.test(val)) {
        throw "password cannot have spaces"
    }
    if(val.length < 8) throw 'Password must be at least 8 characters long';
    if((val.match(/[A-Z]/g) || []).length < 1) throw 'Password must contain at least one uppercase letter';
    if((val.match(/\d/) || []).length < 1) throw 'Password must contain at least one number';
    if((val.match(/[\W_]/g) || []).length < 1) throw 'Password must contain at least one special character';
    return val
}

function confirmCheck(str1, str2){
    if(str1 !== str2){
        throw 'Passwords do not match';
    }
    return;
}

function zipCheck(str){
    str = stringValidate(str);
    if(str.length !== 5){
        throw 'Zipcode must be 5 numbers';
    }
    if(isNaN(str)){
        throw 'Zipcode should only consist of numbers'
    }
    return zipCheck;
}


let signupForm = document.getElementById('signup-form');
let addShopForm = document.getElementById('addShop-form');
let errorDiv = document.getElementById('error');

if(signupForm){
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errors = [];
        if(errorDiv) errorDiv.hidden = true;
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let passwordConf = document.getElementById('passwordConf').value;
        let email = document.getElementById('email').value;
        let zipcode = document.getElementById('zipcode').value;
        try{
            username = stringValidate(username);
        } catch(e){
            errors.push(e.toString());
        }
        try{
            password = passwordCheck(password);
        } catch(e){
            errors.push(e.toString());
        }
        try{
            confirmCheck(password, passwordConf.trim());
        } catch(e){
            errors.push(e.toString());
        }
        try{
            email = stringValidate(email);
        } catch(e){
            errors.push(e.toString());
        }
        try{
            zipcode = zipCheck(zipcode);
        } catch(e){
            errors.push(e.toString());
        }
        if(errors.length > 0){
            errorDiv.hidden = false;
            errorDiv.innerHTML = "<ul>" + errors.map(error => `<li>${error}</li>`).join('') + "</ul>";
        } else{
            signupForm.submit();
        }
    })
}

if(addShopForm){
    addShopForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errors = [];
        if(errorDiv) errorDiv.hidden = true;
        let shopName = document.getElementById('shopName').value;
        let address = document.getElementById('address').value;
        let website = document.getElementById('website').value;
        let phoneNumber = document.getElementById('phoneNumber').value;
        try{
            shopName = stringValidate(shopName);
        } catch(e){
            errors.push(e.toString());
        }
        try{
            address = stringValidate(address);
        } catch(e){
            errors.push(e.toString());
        }
        try{
            website = stringValidate(website);
        } catch(e){
            errors.push(e.toString());
        }
        try{
            phoneNumber = stringValidate(phoneNumber); 
        } catch(e){
            errors.push(e.toString());
        }
        if(errors.length > 0){
            errorDiv.hidden = false;
            errorDiv.innerHTML = "<ul>" + errors.map(error => `<li>${error}</li>`).join('') + "</ul>";
        } else{
            addShopForm.submit();
        }
    })
}
