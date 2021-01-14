const model = require("../models/model");

class Evenement extends model.Model {

  constructor() {
    super();
    this.tableName = "evenement";
    this.tabKey = ["numEvenement"];
  }
  /*
   * objeyVal : {nomColonne : valColonne, nomColone2 : valColone2}
  */
  save(objetVal){
    return super.save(this.tableName,objetVal); 
  }
  
  selectAllWithCount(){
    return new Promise((resolve, reject) => {
      const query = 'select evenement."numEvenement", "nomEvenement", "dateDebut", "dateLimiteResa", "anneePromo", "duree", "nombreMembreJury", "dureeCreneau", count(creneau."idGroupe") as "nbCreneauReserver", count(creneau."numCreneau") as "nbCreneau" from evenement left join creneau on creneau."numEvenement" = evenement."numEvenement" GROUP BY evenement."numEvenement" ORDER BY evenement."anneePromo"';
     
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

  selectAll(){
    return super.selectAll(this.tableName)
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

module.exports = Evenement