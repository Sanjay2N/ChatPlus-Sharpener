
const urlSplit = window.location.href.split('/'); 
const id =urlSplit[urlSplit.length - 1];

const forgotPasswordDiv=document.querySelector("#reset-password-div");
const forgotpasswordElements={
    password1:forgotPasswordDiv.querySelector("#password1"),
    password2:forgotPasswordDiv.querySelector("#password2"),
    resetButton:forgotPasswordDiv.querySelector("#reset-password-button"),
    alert1:forgotPasswordDiv.querySelector("#alert1"),
    alert2:forgotPasswordDiv.querySelector("#alert2")
}

forgotpasswordElements.resetButton.onclick=resetPassword;
async function resetPassword(event){
    try{
        event.preventDefault();
        const password1=forgotpasswordElements.password1.value;
        const password2=forgotpasswordElements.password2.value;
        if(password1===password2){
            const data = {
                resetId:id,
                newpassword: password1,
            };

            await axios.post(`../updatepassword`, data); 
            alertFunction(forgotpasswordElements.alert1);
            setTimeout(()=>{
                window.location.href = `../../home`;
            },3000);
            
        }
        else{
            alertFunction(forgotpasswordElements.alert2)
        }
    }
    catch(error){
        if(error.response && error.response.status===404){
            alertFunction(forgotpasswordElements.alert2);
        }
        else if(error.response && error.response.status===403){
            alert("Link been exiper,Try again..")
        }
        else{
            console.log(error);
        }
    }
    
}


function alertFunction(div){
    div.classList.remove('hidden');
    setTimeout(() => {
        div.classList.add('hidden');
    }, 2000);
}


