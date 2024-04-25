let signupForm = document.getElementById('signup-form');
let addShopForm = document.getElementById('addShop-form');
let editUserForm = document.getElementById('edit-user-form');
let itemForm = document.getElementById('itemForm');
let reviewForm = document.getElementById('reviewForm')
let errorDiv = document.getElementById('error');

function numCheck (num, numName) {
    if (typeof(num) !== 'number'){
        throw (`${num} is not a number`);
    }
    if(isNaN(num)){
        throw (`${num} is not a number`);
    }
};

function checkPrice(price){
    price = parseFloat(price.trim());
    numCheck(price, 'Price');
    if(price != price.toFixed(2)) throw "Price cannot be more than 2 decimal places";
    if(price < 0) throw "Price cannot be negative";
    return price;
}

function stringValidate (val, valName, min=1, max=Number.MAX_VALUE){
    if(!val){
        throw `${valName} is not provided`
    }else if (typeof(val) !== 'string'){
        throw (`${valName} is not a string`);
    }
    val = val.trim()
    if(val.length < min){
        throw `${valName} must be ${min} or more characters`
    }else if(val.length > max){
        throw `${valName} must be ${max} or less characters`
    }
    return val
}

function passwordCheck (val){
    val = stringValidate(val, 'Password')
    if (/\s/.test(val)) {
        throw "Password cannot have spaces"
    }
    if(val.length < 8) throw 'Password must be at least 8 characters long';
    if((val.match(/[A-Z]/g) || []).length < 1) throw 'Password must contain at least one uppercase letter';
    if((val.match(/\d/) || []).length < 1) throw 'Password must contain at least one number';
    if((val.match(/[\W_]/g) || []).length < 1) throw 'Password must contain at least one special character';
    return val
}

function confirmSame(str1, str2){
    if(str1 !== str2){
        throw 'Passwords do not match';
    }
    return;
}

function confirmDiff(str1, str2){
    if(str1 === str2){
        throw 'New password cannot be the same as current password';
    }
    return;
}

function checkAndSubmit(errors, form){
    if(errors.length > 0){
        errorDiv.hidden = false;
        errorDiv.innerHTML = "<ul class=\"error\">" + errors.map(error => `<li>${error}</li>`).join('') + "</ul>";
    } else{
        form.submit();
    }
    return;
}


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
            username = stringValidate(username, 'Username');
        } catch(e){
            errors.push(e.toString());
        }
        try{
            password = passwordCheck(password);
        } catch(e){
            errors.push(e.toString());
        }
        try{
            confirmSame(password, passwordConf.trim());
        } catch(e){
            errors.push(e.toString());
        }
        try{
            email = stringValidate(email, 'Email');
        } catch(e){
            errors.push(e.toString());
        }
        try{
            zipcode = stringValidate(zipcode, 'Zipcode');
        } catch(e){
            errors.push(e.toString());
        }
        checkAndSubmit(errors, signupForm);
    });
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
            shopName = stringValidate(shopName, 'Shop Name');
        } catch(e){
            errors.push(e.toString());
        }
        try{
            address = stringValidate(address, 'Address');
        } catch(e){
            errors.push(e.toString());
        }
        try{
            website = stringValidate(website, 'Website');
        } catch(e){
            errors.push(e.toString());
        }
        try{
            phoneNumber = stringValidate(phoneNumber, 'Phone Number'); 
        } catch(e){
            errors.push(e.toString());
        }
        checkAndSubmit(errors, addShopForm);
    });
}

if(editUserForm){
    editUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errors = [];
        if(errorDiv) errorDiv.hidden = true;   
        let bio = document.getElementById('bio').value;
        let newPassword = document.getElementById('password').value;
        let oldPassword = document.getElementById('oldPassword').value;
        let address = document.getElementById('zip').value;
        if(bio){
            try{
                bio = stringValidate(bio, 'Bio');
            } catch(e){
                errors.push(e.toString());
            }
        }
        if(newPassword){
            try{
                newPassword = passwordCheck(newPassword);
            } catch(e){
                errors.push(e.toString());
            }
            try{
                confirmDiff(newPassword, oldPassword);
            } catch(e){
                errors.push(e.toString());
            }
        }
        if(address){
            try{
                address = stringValidate(address, 'Address');
            } catch(e){
                errors.push(e.toString());
            }
        }
        checkAndSubmit(errors, editUserForm);
    });
}

if(itemForm){
    addShopForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errors = [];
        if(errorDiv) errorDiv.hidden = true;
        let name = document.getElementById("name").value;
        let price = documen.getElementById("price").value;
        let tags = document.querySelectorAll('#tagList input[type="checkbox"] + label');
        let tagArray = Array.from(tags).map(tags => tags.textContent);
        console.log(tagArray);
        let allergens = document.querySelectorAll('#allergenList input[type="checkbox"] + label');
        let allergenArray = Array.from(allergens).map(tags => tags.textContent);
        console.log(allergenArray);
        
        try{
            name = stringValidate(name, 'Item Name');
        } catch(e){
            errors.push(e.toString());
        }
        try{
            price = checkPrice(price);
        } catch(e){
            errors.push(e.toString());
        }
        checkAndSubmit(errors, addShopForm);
    });
}