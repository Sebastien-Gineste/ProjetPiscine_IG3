const model = require("../models/model");

class Participe extends model.Model {

  constructor() {
    super();
    this.tableName = "participe";
    this.tabKey = ["idProf","numCreneau","numEvenement"];
    
  }
  /*
   * objeyVal : {nomColonne : valColonne, nomColone2 : valColone2}
  */
  save(objetVal){
    return super.save(this.tableName,objetVal); 
  }

  saveJury(idE, idC, jury){
    return new Promise((resolve, reject) => {
        var request = 'INSERT INTO participe ( "idProf", "numCreneau", "numEvenement" ) VALUES (';
        var tabValues = []
        var nbVal = 1;
        for(let i = 0; i<jury.length; i++) {
            tabValues.push(jury[i].idProf)
            tabValues.push(idC)
            tabValues.push(idE)
            request += '$'+(i+nbVal)+",$"+(i+1+nbVal)+",$"+(i+2+nbVal)+"),("
            nbVal += 2;
        }

        request = request.substr(0, request.length - 2) // enlève ,(
        request+= " RETURNING *;";

        const query = {
            name: 'save-jury-generique', // réquête préparer
            text: request,
            values: tabValues,
        }

        this.client.query(query, function(error, results) {
            if (error) {
                reject(Error.CONNECTION_ERROR);
                console.log(error)
                return;
            }
            else if(results !== undefined && results.rows !== undefined &&  results.rows.length > 0 ) {
                resolve(results.rows[0])
            } else {
                console.log(error)
                reject(Error.NO_RESULTS);
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

module.exports = Participe