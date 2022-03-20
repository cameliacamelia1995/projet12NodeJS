//Création des éléménts dont j'ai besoin 
//On cache les tableaux
const tableaux = document.getElementById('SuperTableau');
tableaux.style.display = 'none';
//LOGIN
const login = document.querySelector('.classLogin');
const formLogin = document.querySelector('.formloginClass');
const inputEmail = document.getElementById('emailId');
const inputPassword = document.getElementById('passwordId');
const btnConnect = document.getElementById('btnHome');

const placement = document.getElementById('Placement');
// REGISTER
const registerLogin = document.querySelector('.registerC');
const formLoginRegister = document.querySelector('.formRegisterClass');
const inputEmailContact = document.getElementById('registerMailId');
const inputFirstName = document.getElementById('registerFirstNameId');
const inputLastName = document.getElementById('registerLastNameId');
const inputMdp = document.getElementById('registerPasswordId"');
const btnRegister = document.getElementById('btnRegisterId');

//Bouton Deconnecter 
//Tableau de données du contact
const logOut = document.createElement('div');
const btnLogOut = document.createElement('button');
const divData = document.createElement('div');
const btnEditContact = document.createElement('button');
const editFirstName = document.createElement('input');
const editLastName = document.createElement('input');
const editPassword = document.createElement('input');
const editEmail = document.createElement('input');
const saveContact = document.createElement('button');
const divContactInformation = document.createElement('div');
//Tableau données des contract 
const divContracts = document.createElement('div');
//Tableau données des produits
const divProducts = document.createElement('div');

//init html
btnLogOut.innerHTML = "Log Out";
divData.innerHTML = "Your Contact Information";
btnEditContact.innerHTML = "Edit Contact";
saveContact.innerHTML = "Save Contact";
divContracts.innerHTML = "Contracts";
divProducts.innerHTML = "Products";

formLogin.addEventListener(('submit'), (e) => {
    e.preventDefault(); 
    searchExistingContact();
})

var modifiedLastName;
var modifiedFirstName;
var modifiedEmail;
var modifiedPassword;
var contactIdFromServe;

//Fonction ajax qui permet de trouver les contacts existant
function searchExistingContact() {
    $.ajax({
        url: '/api/getContact',
        method: "POST",
        contentType: "application/json",
            data: JSON.stringify({
                password: $('#passwordId').val(),
                email: $('#emailId').val()
            }),
            //Obtenir les données de SF et l'ai placer dans le tableau
        success: function (contact) {
            contactIdFromServe = contact.sfid;
            modifiedFirstName = contact.firstname;
            modifiedLastName = contact.lastname;
            modifiedEmail = contact.email;
            modifiedPassword = contact.password__c;
            $('#nameIdServer').text(contact.name);
            $('#emailIdServer').text(contact.email);
            $('#passwordIdServer').text(contact.password__c);
            loginSuccess();
            alert('connexion réussi');
            //On appelle la méthode après que la connexion
            searchContract();
            console.log(modifiedLastName);
            console.log(modifiedFirstName);
            console.log(modifiedPassword);
            console.log(modifiedEmail);
        },
        error:function(error){
            console.log(error);
            console.log('impossible to connect');
        }
    });
}
function loginSuccess() {
    login.style.display = 'none';
    registerLogin.style.display = 'none';
    tableaux.style.display = 'block';
}

function searchContract() {
    $.ajax({
        url:'/Contracts',
        method:'GET',
        contentType:'application/json',
        success: function(response) {
            $('#contractId').html(response.html);
        },
        error: function() {
            alert('error please check log.');
        }
    })
}