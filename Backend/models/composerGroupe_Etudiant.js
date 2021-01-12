const model = require("../models/model");

class Composer extends model.Model {

  constructor() {
    super();
    this.tableName = "composer";
    this.tabKey = ["idGroupe"];
    
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

  /*  
   * id : [val Clé primaire]
  */
  select(id){
    return new Promise((resolve, reject) => {
      const query = {
          name: 'selectCompoEtudiant', // réquête préparer
          text: 'SELECT etudiant."numEtudiant", etudiant."nomEtudiant", etudiant."prenomEtudiant" FROM composer JOIN etudiant ON etudiant."numEtudiant" = composer."numEtudiant" WHERE composer."idGroupe" = $1',
          values: id
      };
     
      model.client.query(query, function(error, results) {
          if (error) {
              console.log(error)
              reject(model.Error.CONNECTION_ERROR);
              return;
          }
          if(results !== undefined && results.rows !== undefined &&  results.rows.length > 0 ) {
            resolve(results.rows);
          } else {
              // pas de résultat
              reject(model.Error.NO_RESULTS);
          }
      });
    }); 
  }

  /*  
   * id : [val Clé primaire]
  */
  delete(id,idEtud){
    console.log("ouuuuuu")
    return super.delete(this.tableName,["idGroupe","numEtudiant"],[id, idEtud])
  }

  /*
   * objeyVal : {nomColonne : newvalColonne, nomColone2 : newValColone2}
   * id : [val Clé primaire]
  */
  update(id, objetVal){
    return super.update(this.tableName, this.tabKey, id, objetVal)
  }

}

module.exports = Composer