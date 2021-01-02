const model = require("../models/model");
const bcrypt = require("bcrypt");

class Etudiant extends model.Model {

  constructor() {
    super();
    this.tableName = "etudiant";
    this.tabKey = ["numEtudiant"];
    
  }

  checkConnexion(email, mdp){
    return new Promise((resolve, reject) => {
      const query = {
          name: 'select-userByEmail', // réquête préparer
          text: 'SELECT etudiant."numEtudiant", etudiant."mdpEtudiant", etudiant."estAdmin", composer."idGroupe" FROM ' + this.tableName + ' LEFT JOIN composer ON composer."numEtudiant" = etudiant."numEtudiant" WHERE "emailEtudiant" = $1',
          values: [email],
      };
     
      model.client.query(query, function(error, results) {
          if (error) {
              console.log(error)
              reject(model.Error.CONNECTION_ERROR);
              return;
          }
          if(results !== undefined && results.rows !== undefined &&  results.rows.length > 0 ) {
            if(results.rows.length > 1 ){
              reject(model.Error.TOO_MANY_RESPONSE)
            }
            else{ // Utilisateur Bien retourné
              bcrypt.compare(mdp, results.rows[0].mdpEtudiant).then(valid => {
                if(!valid){
                  reject(model.Error.BAD_PASSWORD);
                }
                else{
                  resolve(results.rows);
                }
              })
            }  
          } else {
              // pas de résultat
              reject(model.Error.NO_RESULTS);
          }
      });
  });
  }

  /*
   * objeyVal : {nomColonne : valColonne, nomColone2 : valColone2}
  */
  save(objetVal){
    return super.save(this.tableName,objetVal); 
  }

  selectAll(){
    return super.selectAll(this.tableName)
  }

  selectByEmail(email){
    return super.select(this.tableName,["emailEtudiant"],email)
  }

  /*  
   * id : [val Clé primaire]
  */
  select(id){
    return super.select(this.tableName,this.tabKey,id)
  }

  /*  
   * id : [val Clé primaire]
  */
  delete(id){
    return super.delete(this.tableName,this.tabKey,id)
  }

  /*
   * objeyVal : {nomColonne : newvalColonne, nomColone2 : newValColone2}
   * id : [val Clé primaire]
  */
  update(id, objetVal){
    return super.update(this.tableName, this.tabKey, id, objetVal)
  }

}

module.exports = Etudiant