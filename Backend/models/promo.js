const model = require("../models/model");

class Promo extends model.Model {

  constructor() {
    super();
    this.tableName = "promo";
    this.tabKey = ["annePromo"];
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

  selectAllVerifEvent(){
    return new Promise((resolve, reject) => {
      const query = 'select promo."annePromo", "numEvenement" from promo left join evenement on evenement."anneePromo" = promo."annePromo"';
     
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

module.exports = Promo