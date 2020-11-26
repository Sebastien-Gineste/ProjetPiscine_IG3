const client = require("../config/conf");

const Model = require("../models/model");


class Etudiant extends Model {

  constructor() {
    super();
    this.tableName = "etudiant";
    this.cle = "numEtudiant";
  }

  save (){
    return super.save(this.tableName);
  }

  selectAll(){
    return super.selectAll(this.tableName)
  }

}

module.exports = Etudiant