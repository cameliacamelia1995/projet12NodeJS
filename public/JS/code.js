//Création des éléménts dont j'ai besoin 
//On cache les tableaux
const tableaux = document.getElementById('SuperTableau').style.display = "none";
//LOGIN
const login = document.createElement('section');
const formLogin = document.createElement('form');
const labelLogin = document.createElement('label');
const inputEmail = document.createElement('input');
const labelPassword = document.createElement('label');
const inputPassword = document.createElement('input');
const btnConnect = document.createElement('button');

const placement = document.getElementById('#Placement')
placement.appendChild(login);
login.appendChild(formLogin);
formLogin.appendChild(labelLogin);
formLogin.appendChild(inputEmail);
formLogin.appendChild(labelPassword);
formLogin.appendChild(inputPassword);
formLogin.appendChild(btnConnect);

// REGISTER
const registerLogin = document.createElement('section');
const formLoginRegister = document.createElement('form');
const labelEmailContact = document.createElement('label');
const inputEmailContact = document.createElement('input');
const labelFirstNameContact = document.createElement('label');
const inputFirstName = document.createElement('input');
const labelLastName = document.createElement('label');
const inputLastName = document.createElement('input');
const labelMdp = document.createElement('label');
const inputMdp = document.createElement('input');
const btnRegister = document.createElement('button');

login.after(registerLogin);
registerLogin.appendChild(formLoginRegister);
formLoginRegister.appendChild(labelEmailContact);
formLoginRegister.appendChild(inputEmailContact);
formLoginRegister.appendChild(labelFirstNameContact);
formLoginRegister.appendChild(inputFirstName);
formLoginRegister.appendChild(labelLastName);
formLoginRegister.appendChild(inputLastName);
formLoginRegister.appendChild(labelMdp);
formLoginRegister.appendChild(inputMdp);

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
inputLogin.innerHTML = "Email";
inputPassword.innerHTML = "Password";
inputFirstName.innerHTML = "First Name";
inputLastName.innerHTML = "Last Name";
inputEmail.innerHTML = "Email"
inputMdp.innerHTML = "Choose a password";
btnConnect.innerHTML = "Login";
btnRegister.innerHTML = "Register";
btnLogOut.innerHTML = "Log Out";
divData.innerHTML = "Your Contact Information";
btnEditContact.innerHTML = "Edit Contact";
saveContact.innerHTML = "Save Contact";
divContracts.innerHTML = "Contracts";
divProducts.innerHTML = "Products";










