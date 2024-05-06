let signupForm = document.getElementById('signup-form');
let addShopForm = document.getElementById('addShop-form');
let editUserForm = document.getElementById('edit-user-form');
let itemForm = document.getElementById('itemForm');
let reviewForm = document.getElementById('reviewForm')
let errorDiv = document.getElementById('error');
let flagForm = document.getElementById('flagForm');

function numCheck (num, numName) {
    if (typeof(num) !== 'number'){
        throw (`${numName} is not a number`);
    }
    if(isNaN(num)){
        throw (`${numName} is not a number`);
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

function checkAndSubmit(errors, form) {
    if (errors.length > 0) {
        errorDiv.hidden = false;
        errorDiv.innerHTML = "<ul class=\"error\">" + errors.map(error => `<li>${error}</li>`).join('') + "</ul>";
    } else {
        form.submit();
    }
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

if(flagForm){
    flagForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errors = []
        let description = document.getElementById('description').value;
        if(description){
            try{
                description = stringValidate(description, 'description');
            } catch(e){
                errors.push(e.toString());
            }
        }
        checkAndSubmit(errors, flagForm);
    })
}

if(editUserForm){
    editUserForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errors = [];
        if(errorDiv) errorDiv.hidden = true;   
        let bio = document.getElementById('bio').value;
        let newPassword = document.getElementById('password').value;
        let oldPassword = document.getElementById('oldPassword').value;
        let address = document.getElementById('address').value;
        let pfp = document.getElementById('pfp').value;

        if(bio){
            try{
                bio = stringValidate(bio, 'Bio');
            } catch(e){
                errors.push(e.toString());
            }
        }
        if(!oldPassword){
            errors.push('Input password to make changes')
        }
        if(newPassword){
            try{
                newPassword = passwordCheck(newPassword);
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
        if(pfp){
            try{
                pfp = stringValidate(pfp, 'Profile Picture');
            } catch(e){
                errors.push(e.toString());
            }
        }
        checkAndSubmit(errors, editUserForm);
    });

    document.addEventListener("DOMContentLoaded", function() {
        const buttons = document.querySelectorAll('.pfp-option');
    
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => {
                    btn.style.borderColor = '';
                });
                this.style.borderColor = '#1c6ad7cc';
                const dataValue = this.getAttribute('data-value')
                document.getElementById('profile').value = dataValue;
            });
        });
    });
}

if(itemForm){
    itemForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let errors = [];
        if(errorDiv) errorDiv.hidden = true;
        let name = document.getElementById("name").value;
        let price = document.getElementById("price").value;
        let calories = document.getElementById("calories").value;
        let description = document.getElementById("description").value;
        let tags = document.querySelectorAll('#tagList input[type="checkbox"]:checked');
        let tagArray = Array.from(tags).map(tags => tags.id);
        let allergens = document.querySelectorAll('#allergenList input[type="checkbox"]:checked');
        let allergenArray = Array.from(allergens).map(tags => tags.id);
        
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
        try{
            calories = parseInt(calories);
            numCheck(calories);
            if(!Number.isInteger(calories)){
                throw (`${calories} is not an integer`);
            }
            if(calories < 0){
                throw 'invalid calories'
            }
        } catch(e){
            errors.push(e.toString());
        }
        try{
            description = stringValidate(description);
        } catch(e){
            errors.push(e.toString());
        }
        try{
             const tags  = ['taro', 'matcha', 'honeydew', 'mango', 'lychee', 'strawberry', 'tapioca', 'jelly', 'milk_foam', 'iced', 'hot', 'milk', 'fruit_tea', 'coffee', 'slush', 'vegan'];
             for(let tag of tagArray){
                if(!tags.includes(tag)){
                    throw "Invalid Tag"
                }
             }
        }catch(e){
            errors.push(e.toString());
        }
        try{
             const allergens  = ['gluten', 'dairy', 'peanuts', 'treenuts', 'sesame', 'mustard', 'soy', 'eggs', 'fish', 'shellfish'];
             for(let allergen of allergenArray){
                if(!allergens.includes(allergen)){
                    throw "Invalid Tag"
                }
             }
        }catch(e){
            errors.push(e.toString());
        }

        const tagElement = document.createElement('input');
        tagElement.type = 'hidden';
        tagElement.name = 'tags';
        tagElement.value = tagArray.toString();
        itemForm.appendChild(tagElement);
        
        const allergenElement = document.createElement('input');
        allergenElement.type = 'hidden';
        allergenElement.name = 'allergens';
        allergenElement.value = allergenArray.toString();
        itemForm.appendChild(allergenElement);

        checkAndSubmit(errors, itemForm);
    });
}