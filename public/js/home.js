// navbar
const navbar=document.querySelector("#nav");
const homeButton=navbar.querySelector("#home-button");
const loginButton=navbar.querySelector("#login-button");
const joinButton1=navbar.querySelector("#join-button1");
const joinButton2=document.querySelector("#join-button2");

const signUpDiv=document.querySelector("#signup-div");
const logInDiv=document.querySelector("#login-div");
const resetPasswordDiv=document.querySelector("#reset-password-div");
const sloganDiv=document.querySelector("#slogan");
let currentDiv=sloganDiv;
let curretActiveButton=homeButton;


function changeButtonColor(button){
    curretActiveButton.classList.remove("text-pink-400" ,"underline","underline-offset-4");
    curretActiveButton.classList.add("text-white");
    button.classList.add("text-pink-400" ,"underline","underline-offset-4")  ;
    button.classList.remove("text-white");
    curretActiveButton=button;
}


homeButton.onclick=(e)=>{
    changeButtonColor(homeButton);
    switchDivs(sloganDiv);
}
loginButton.onclick=(e)=> {
    changeButtonColor(loginButton);
    switchDivs(logInDiv);
}
joinButton1.onclick=(e)=>{
    changeButtonColor(joinButton1);
    switchDivs(signUpDiv);
}
joinButton2.onclick=(e)=>{
    changeButtonColor(joinButton1);
    switchDivs(signUpDiv);
}
function switchDivs(divElement){
    currentDiv.classList.add("hidden");
    divElement.classList.remove("hidden");
    currentDiv=divElement;
}


// signup part
const signUpForm=document.querySelector("#signup-form");
const signUpElements={
    signUpButton:signUpForm.querySelector("#signup-button"),
    name:signUpForm.querySelector("#name"),
    email:signUpForm.querySelector("#email1"),
    phonenumber:signUpForm.querySelector("#phonenumber"),
    password1:signUpForm.querySelector("#password1"),
    password2:signUpForm.querySelector("#password2"),
    loginLink:signUpForm.querySelector("#login-button"),
    alert1:signUpForm.querySelector("#alert1"),
    alert2:signUpForm.querySelector("#alert2"),
    alert3:signUpForm.querySelector("#alert3"),
    alert4:signUpForm.querySelector("#alert4"),
    alert10:signUpForm.querySelector("#alert10"),
    
}
signUpElements.loginLink.onclick=(e)=>{
    e.preventDefault();
    switchDivs(logInDiv);
    changeButtonColor(loginButton);
    curretActiveButton=loginButton;
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

            if(password1.length<4){
                alertFunction(signUpElements.alert10);
                signUpElements.password1.value="";
                signUpElements.password2.value="";
            }
            else if(password1!=password2){
                alertFunction(signUpElements.alert3);
                signUpElements.password1.value="";
                signUpElements.password2.value="";
            }
            else{
                const userDetails={
                    name:name,
                    email:email,
                    phonenumber:phonenumber,
                    password:password1
            }
            
                await axios.post("user/signup",userDetails);
                alertFunction(signUpElements.alert1);
                signUpForm.reset();
                setTimeout(() => {
                    switchDivs(logInDiv);
                    changeButtonColor(loginButton);
                    curretActiveButton=loginButton;
                }, 2100);
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
    setTimeout(() => {
        div.classList.add('hidden');
    }, 2000);
}

//forget password
const forgetPasswordDiv=document.querySelector("#forget-password-div");
const forgetElement={
    emailInput:forgetPasswordDiv.querySelector("#email3"),
    sendButton:forgetPasswordDiv.querySelector("#forget-password-button"),
    alert1:forgetPasswordDiv.querySelector("#alert8"),
    alert2:forgetPasswordDiv.querySelector("#alert9"),
}


forgetElement.sendButton.onclick=forgotPassward;
async function forgotPassward(event){
    try{
        event.preventDefault();
        const userEmail = forgetElement.emailInput.value;
        await axios.post("user/forgotpassword", {email: userEmail});
        alertFunction(forgetElement.alert1);
        forgetElement.emailInput.innerText="";
        setTimeout(()=>{
            switchDivs(logInDiv);
        },3000)
        
    }
    catch(error){
        if(error.response && error.response.status === 404){
            alertFunction(forgetElement.alert2);
        }
        else{
            console.log(error);
        }
    }
}




// login part
const logInForm=document.querySelector("#login-form");
const logInElements={
    logInButton:logInForm.querySelector("#login-button"),
    email:logInForm.querySelector("#email2"),
    password:logInForm.querySelector("#password3"),
    signUpLink:logInForm.querySelector("#signup-button"),
    forgetPasswordLink:logInForm.querySelector("#forget-password-link"),
    alert1:logInForm.querySelector("#alert5"),
    alert2:logInForm.querySelector("#alert6"),
    alert3:logInForm.querySelector("#alert7"),
}
logInElements.signUpLink.onclick=(e)=>{
    e.preventDefault();
    switchDivs(signUpDiv);
    changeButtonColor(joinButton1);
    curretActiveButton=joinButton1;
}
logInElements.forgetPasswordLink.onclick=(e)=>{
    e.preventDefault();
    switchDivs(forgetPasswordDiv);
}


logInElements.logInButton.addEventListener("click",logIn);
async function  logIn(event){
    try{
        event.preventDefault();
        const credentials={
                email:logInElements.email.value,
                password:logInElements.password.value  
                }
        await axios.post("user/login",credentials);
        alertFunction(logInElements.alert1);
        logInForm.reset();
        setTimeout(()=>{
            window.location.href="user";
        },2000)
    }
    catch(error){
        if (error.response && error.response.status === 404) {
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
        }
        
    }
}

