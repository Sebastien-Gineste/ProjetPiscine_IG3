const model = require("../models/model");

class Creneau extends model.Model {

  constructor() {
    super();
    this.tableName = "creneau";
    this.tabKey = ["numCreneau"];
    
  }
  /*
   * objeyVal : {nomColonne : valColonne, nomColone2 : valColone2}
  */
  save(objetVal){
    return super.save(this.tableName,objetVal); 
  }

  /*
   * tabCreneau : [{dateCreneau : ...., heureDebut : ...., numEvent : numEvent},...]
  */
  generate(tabCreneau){
    return new Promise((resolve, reject) => {
      var request = 'INSERT INTO creneau ("date","numEvenement","heureDebut") VALUES (';
      var tabValues = []
      var nbVal = 0;

      for (let i = 1;i<=tabCreneau.length;i++){
        request += '$'+(i+nbVal)+",$"+(i+1+nbVal)+",$"+(i+2+nbVal)+"),("
        nbVal += 2;
        tabValues.push(tabCreneau[i-1].date);
        tabValues.push(tabCreneau[i-1].numEvenement);
        tabValues.push(tabCreneau[i-1].heureDebut);
      }

      request = request.substr(0, request.length - 2) + " RETURNING *" // enlève ,(

      const query = {
          name: 'save-generation', // réquête préparer
          text: request,
          values: tabValues,
      }

      model.client.query(query, function(error, results) {
          if (error) {
              reject(model.Error.CONNECTION_ERROR);
              console.log(error)
              return;
          }
          else if(results !== undefined && results.rows !== undefined &&  results.rows.length > 0 ) {
              resolve(results.rows)
          } else {
              console.log(error)
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
   * numEvent = val Clés primaire Evenement  
  */
  deleteAll(numEvent){
    return new Promise((resolve, reject) => {
      var request = 'DELETE FROM '+this.tableName+' WHERE "numEvenement" = $1'

      const query = {
          name: 'delete-all-creneau', // réquête préparer
          text: request,
          values: [numEvent],
        }

        model.client.query(query, function(error, results) {
          if (error) {
              reject(model.Errors.CONNECTION_ERROR);
              return;
          } else {
              resolve(true);
          }
      });
    });
  }

  /*
   * numEvent = val Clés primaire Evenement  
   * tabDate = ["yyyy-mm-dd",...]
   * Supprime les créneaux qui n'ont pas de date compris dans le tabDate
  */
  deleteWhere(numEvent,tabDate){
    return new Promise((resolve, reject) => {
      var request = "DELETE FROM creneau where creneau.\"date\" not IN ("

      for (let i = 1;i<=tabCreneau.length;i++){
        request += '$'+i+','
      }

      request = request.substr(0, request.length - 1) + ") " // enlève ,

      const query = {
          name: 'delete-where-creneau', // réquête préparer
          text: request,
          values: tabDate,
        }

        model.client.query(query, function(error, results) {
          if (error) {
              reject(model.Errors.CONNECTION_ERROR);
              return;
          } else {
              resolve(true);
          }
      });
    });
  }

  /*
   * objeyVal : {nomColonne : newvalColonne, nomColone2 : newValColone2}
   * id : [val Clé primaire]
  */
  update(id, objetVal){
    return super.update(this.tableName, this.tabKey, id, objetVal)
  }

}

module.exports = Creneau