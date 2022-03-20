//Conexion avec la base de donnée Heroku
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const pg = require('pg');
//const { request } = require('http');
const { finished } = require ('stream');
const { query } = require('express');
const application = express();
application.use(express.urlencoded({ extended: true }));
application.use(express.json());
application.use(express.static('public'));
application.use(bodyParser.json());
application.set('port', port);
//application.use('/JS', function(req, res){
   //res.render('code.js');
  //});
  //application.get("./public/JS/code.js");
  //const main = require('./public/JS/code.js');
  //application.use("/",main);

const uriSecret = "postgres://qwcogjcmfxiyzx:88305fec0738f8cf1eb9699121ebd57195288d62589f98d71c38d8b4e84517b1@ec2-52-215-225-178.eu-west-1.compute.amazonaws.com:5432/davvuubgb8ib1v";
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL || uriSecret, ssl: {rejectUnauthorized: false }});

client.connect(error => {
        if (error) {
            console.error('Connection error', error.stack)} 
        else {
            console.log('Connected')}})

//Requête NODE qui permet de récupérer les comptes
application.get('/Account', (request, response) => {
    
    try {
        client.query("SELECT * FROM salesforce.account").then((accounts)=> {
            console.log(accounts.rows);
            response.json(accounts.rows);
        });
    }
    catch(error) {
        console.error(error.message);     
    }
});
   
application.get('/Contact', (request, response) => {
    
    try {
        client.query("SELECT * FROM salesforce.contact").then((contacts)=> {
            console.log(contacts.rows);
            response.json(contacts.rows);
        });
    }
    catch(error) {
        console.error(error.message);     
    }
});
//Requête pour obtenir 1 contact grâce a son contact
//Son ID est dans l'uri et on l'a place dans la query a la première position $
application.get('/Contact/:id', (request, response) => {
    
    try {
        const { id } = request.params;
        client.query("SELECT * FROM salesforce.contact WHERE id = $1", [id]).then((contact)=> {
            console.log(contact.rows[0]);
            response.json(contact.rows[0]);
        });
    }
    catch(error) {
        console.error(error.message);     
    }
});
//Requête qui permet d'obtenir les contrats
application.get('api/GetContract', (request, response) => {
    try {
        client.query("SELECT * FROM salesforce.contract").then((data)=> {
            var contractsContent = data.rows;
            var tableContract = '<table class="Contract" border=1>'+
            '<thead><tr><th>Contract Number</th><th>Start Date</th><th Contract Term</th></tr>'+
            '</thead>'+
            '<tbody>';
            contractsContent.forEach(contract => {
                var dateStart = contract.startdate;
                var DateConverted = dateStart.toLocaleDateString('en-US');
               tableContract = tableContract+'<tr><td>'+contract.contractnumber+'</td><td>'+contract.status+'</td><td>'+DateConverted+'</td><td>'+contract.contractterm+'</td></tr>';              
            });
            tableContract = tableContract+'</tbody></table>';
            response.send({html: tableContract});
        });
    } catch (error) {
        console.error(error.message);
    }});

//Requête pour obtenir 1 contact grâce a son contact
//Son ID est dans l'uri et on l'a place dans la query a la première position $
application.get('/Contract/:id', (request, response) => {
    
    try {
        const { id } = request.params;
        client.query("SELECT * FROM salesforce.contract WHERE id = $1", [id]).then((contract)=> {
            console.log(contract.rows[0]);
            response.json(contract.rows[0]);
        });
    }
    catch(error) {
        console.error(error.message);     
    }
});

//Cette méthode va crée un contact dans SF 
application.post('/api/Contacts', (request, response) => {
    
try {
    //ces variables correspondent a ce qui va être envoyé dans le corps de la requête
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var email = request.body.email;
    var password = request.body.password;
    var contactCreation = client.query("SELECT sfid, id FROM salesforce.contact WHERE email = $1",[email])
    .then((contact)=> {
    
        //Si le contact est défini (il a tous les champs) mais qu'il n'est pas trouvé dans SF on le crée
        //Sinon on retourne son sfid
        if(contact !== undefined ) {
            if(contact.rowCount === 0) {
                contactCreation = client.query("insert into salesforce.contact(email, firstname, lastname, password) value($1, $2, $3, $4) returning id", [email, firstName, lastName, password])
                .then((contact) => {response.json(contact.rows[0].id);});
            }
            else {
                contactCreation = client.query("SELECT sfid, id FROM salesforce.contact WHERE email = $1",[email])
                .then((contact) => {response.json(contact.rows[0].sfid);});
            }}
            //Si le contact est défini on obtient son mail en retour 
            else{
                response.json(contactCreation.rows[0]);
             }});} 
            
             catch(error) {
                 console.error(error.message);
        }});
        //Création d'une requête qui permet de retrouver le contact qui se connecte
application.post('/api/getContact',(request, response)=> { 
    var emailContact = request.body.email;
    var passwordContact = request.body.password;
    try {
        client.query('select * from salesforce.contact where email = $1 and password__c = $2', [emailContact, passwordContact])
        .then((contact)=>{
            var data = contact.rows[0];
            response.json(data);
        });
    } catch(error) {
        console.log(error);

    }
});
    
        //Création d'un contrat 
application.post('/Contract/', (request, response) => {

        try {
            //Ces variables correspondent a ce qui va être dans le corps de la requête sauf la acctsID qui sera trouver plu tard dans la requête
            var acctsId = '';
            var accountName = request.body.name;
            var contractEnd = request.body.contractTerm;
            var statusContract = request.body.status;
            var dateStart = request.body.date;

            //On cherche le sfid des comptes sf avec le nom en première position
            client.query("SELECT sfid FROM salesforce.account WHERE name = $1",[accountName])
            .then((accounts) => {
                //On récupère le sfid du compte dans la variable
                acctsId = account.rows[0].sfid;
                //On insère le contrat avec les champs requis et dans l'ordre correspondant 
                //Et on retourne l'id du compte
                client.query("insert into salesforce.contract(accountId, status, startdate, contractTerm) values($1, $2, $3, $4)returning id", [acctsId, statusContract, dateStart, contractEnd])
              .then((accounts) => {
                  //On récupère l'id du compte
                    response.json(account.rows[0].id);
                })
            })}
            catch(error) {
                console.error(error.message);
        }});
        
        //Lors d'une requête de suppression on met a jour le statut du contact sans le supp
application.patch('/Contact/:id', (request, response) => {
           try {
                const{ id } = request.params;
                client.query('update salesforce.contact set status__c = Desactivated WHERE id = $1', [id])
                .then((contact) => {
                    response.json(contact);
                });
            }
            catch(error) {
                console.error(error.message);
            }});

//Mettre a jour les contacts avec les champs requis
application.put('/Contact/:id', (request, response) => {
    try {
    const{ id } = request.params;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var email = request.body.email;
    var password = request.body.password;
    client.query = ('update salesforce.contact set firstname = $1 lastname = $2, email = $3, password = $4 WHERE Id = $5', [firstName, lastName, email, password, id])
    .then((contact) => {
        response.json(contact);
        console.log(contact);
    
    });} catch(error) {
        console.error(error.message);
    }});

    //Mettre a jour les contrats avec les champs requis
    application.put('/Contract/:id', (request, response) => {
        try {
            const{ id } = request.params;
            var sfidAcc = '';
            var accountName = request.body.name;
            var contractEnd = request.body.contractTerm;
            var statusContract = request.body.status;
            var dateStart = request.body.date;
            client.query("SELECT sfid FROM salesforce.account WHERE name = $1",[accountName])
            .then((accounts) => {
                sfidAcc = accounts.rows[0].sfid;
                client.query("update salesforce.contract set status = $1, startDate = $2, contractTerm = $3 WHERE accountId = $4 and Id = $5 ", [statusContract, dateStart, contractEnd, sfidAcc, id])
                .then((contract) => {
                    response.json(contract);
                });
            });} 
            catch (error) {
                console.error(error.message);
            }});

//Ecoute du port du serveur au moment ou la connexion se fait
application.listen(port,() => console.log(`listening to ${ port }`));