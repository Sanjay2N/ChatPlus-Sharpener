

// signup part
const signUpForm=document.querySelector("#signup-form");
const signUpElements={
    signUpButton:signUpForm.querySelector("#signup-button"),
    name:signUpForm.querySelector("#name"),
    email:signUpForm.querySelector("#email"),
    phonenumber:signUpForm.querySelector("#phonenumber"),
    password1:signUpForm.querySelector("#password1"),
    password2:signUpForm.querySelector("#password2"),
    alert1:signUpForm.querySelector("#alert1"),
    alert2:signUpForm.querySelector("#alert2"),
    alert3:signUpForm.querySelector("#alert3"),
    alert4:signUpForm.querySelector("#alert4"),
    
}

signUpElements.signUpButton.addEventListener("click",signUp);
async function signUp(event){
    try{
        event.preventDefault();
        if(signUpForm.checkValidity()){
            const name=signUpElements.name.value;
            const email=signUpElements.email.value;
            const phonenumber=signUpElements.phonenumber.value;
            const password1=signUpElements.password1.value;
            const password2=signUpElements.password2.value;

            if(password1==password2){
                const userDetails={
                    name:name,
                    email:email,
                    phonenumber:phonenumber,
                    password:password1
                }
                await axios.post("http://localhost:2000/user/signup",userDetails);
                alertFunction(signUpElements.alert1);
                signUpForm.reset();
            }
            else{
                alertFunction(signUpElements.alert3);
                signUpElements.password1.value="";
                signUpElements.password2.value="";
            }
            
        }
    }
    catch(error){
        if (error.response && error.response.status === 409) {
            event.preventDefault();
            alertFunction(signUpElements.alert2);
            signUpForm.reset();
        } 
        else if (error.response && error.response.status === 400) {
            event.preventDefault();
            alertFunction(signUpElements.alert4);
        }
        else {
            alert("Something went wrong - signup again")
            console.error("An error occurred:", error);
        }
        
    }
}

function alertFunction(div){
    div.classList.remove('hidden');
    // div.classList.add('block');
    setTimeout(() => {
        // div.classList.remove('block');
        div.classList.add('hidden');
    }, 3000);
}



// login part
const logInForm=document.querySelector("#login-form");
console.log(logInForm)
const logInElements={
    logInButton:logInForm.querySelector("#login-button"),
    email:logInForm.querySelector("#email"),
    password:logInForm.querySelector("#password"),
    alert1:logInForm.querySelector("#alert1"),
    alert2:logInForm.querySelector("#alert2"),
    alert3:logInForm.querySelector("#alert3"),
}
logInElements.logInButton.addEventListener("click",logIn);
async function  logIn(event){
    try{
        event.preventDefault();
        
        const credentials={
                email:logInElements.email.value,
                password:logInElements.password.value  
                        }
        console.log(credentials);
        await axios.post("http://localhost:2000/user/login",credentials);
        alertFunction(logInElements.alert1);
        logInForm.reset();
    }
    catch(error){
        if (error.response && error.response.status === 409) {
            event.preventDefault();
            alertFunction(logInElements.alert3);
            logInForm.reset();
        } 
        else if (error.response && error.response.status === 401) {
            event.preventDefault();
            alertFunction(logInElements.alert2);
        }
        else {
            alert("Something went wrong - login again")
            console.error("An error occurred:", error);
        }
        
    }
}