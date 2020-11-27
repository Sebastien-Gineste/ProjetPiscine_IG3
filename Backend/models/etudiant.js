const Model = require("../models/model");

class Etudiant extends Model {

  constructor() {
    super();
    this.tableName = "etudiant";
    this.tabKey = ["numEtudiant"];
    
  }

  save (){
    return super.save(this.tableName,{nomProf :"nom" , prenomProf : "prenom "}); // mettre un objet étudiant
  }

  selectAll(){
    return super.selectAll(this.tableName)
  }

  select(){
    return super.select(this.tableName,this.tabKey,[1])
  }

  delete(){
    return super.delete(this.tableName,this.tabKey,[14])
  }

  update(){
    return super.update(this.tableName, this.tabKey, [13], {nomProf:"Villaret"}) // metre objet étudiant
  }

}

module.exports = Etudiant