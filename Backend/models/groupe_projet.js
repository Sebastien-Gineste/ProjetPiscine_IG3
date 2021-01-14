const model = require("../models/model");

class Groupe extends model.Model {

  constructor() {
    super();
    this.tableName = "groupe_projet";
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

  selectCreneauOfGroupe(id){
    return new Promise((resolve, reject) => {
      const query = {
          name: 'select-creneauOfGroupe', // réquête préparer
          text: 'select "numCreneau" from groupe_projet join creneau on creneau."idGroupe" = groupe_projet."idGroupe" where groupe_projet."idGroupe" = $1',
          values: [id],
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
                  resolve(results.rows);
            }  
          } else {
              // pas de résultat
              resolve(true);
          }
      });
    });
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

module.exports = Groupe