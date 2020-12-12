const client = require("../config/conf")

const Errors = {
    NO_RESULTS: new Error('No results'),
    BAD_REQUEST: new Error('Bad request'),
    CONNECTION_ERROR: new Error('Unable to query database'),  
    TOO_MANY_RESPONSE: new Error('Trop de valeur retourné'),
    BAD_PASSWORD: new Error("Mauvais mots de passe"),
  }
exports.client = client;
exports.Error = Errors;
exports.Model = class Model{ // Model générique pour les tables de la base de données;

    constructor(){
        this.client = client; // Il contient la connexion à la base de données
    }

    /*
     * tablename = nom de la table du model fil au model générique
     * objectVal = {colonne : val, colonne2 : val2, ...}
     */
    save (tableName,objectVal){
        return new Promise((resolve, reject) => {
            var request = 'INSERT INTO '+tableName+'(';
            var tabValues = []
            var strValue = "";
            var i = 1;
            for (const [key, value] of Object.entries(objectVal)) {
                request += "\""+key+"\",";
                tabValues.push(value)
                strValue += "$"+i+",";
                i++;
            }

            request = request.substr(0, request.length - 1) // enlève la dernière virgule
            request+= ") VALUES("+strValue.substr(0, strValue.length - 1)+") RETURNING *";
            
            const query = {
                name: 'save-générique', // réquête préparer
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
    /*
     * tablename = nom de la table du model fil au model générique
     * tabKey = [clés primaire,..,nième clés primaire]
     * tabKeySearch = [valeur 1er clés primaire,.., valeur nième clés primaire]
     */
    select(tableName,tabKey, tabKeySearch){
        return new Promise((resolve, reject) => {
            var request = 'SELECT * FROM '+tableName+' WHERE';
            for (let i=0;i<tabKey.length;i++){
                request += " \""+tabKey[i]+"\" = $"+(i+1);
            }

            const query = {
                name: 'select-générique-'+tableName, // réquête préparer
                text: request,
                values: tabKeySearch,
              }

            this.client.query(query, function(error, results) {
                if (error) {
                    reject(Error.CONNECTION_ERROR);
                    return;
                }
                
                if(results !== undefined && results.rows !== undefined &&  results.rows.length > 0 ) {
                    resolve(results.rows)
                } else {
                    // pas de résultat
                    reject(Error.NO_RESULTS);
                }
            });
        });
    }
    /*
     * tablename = nom de la table du model fil au model générique
     */
    selectAll(tableName){
        return new Promise((resolve, reject) => {
            this.client.query('SELECT * FROM '+tableName, function(error, results) {
                if (error) {
                    reject(Error.CONNECTION_ERROR);
                    return;
                }
                if(results.rows[0] !== undefined) {
                    resolve(results.rows)
                } else {
                    reject(Error.NO_RESULTS);
                }
            });
        });
    }

    /*
     * tableName = nom de la table du model fil au model générique
     * tabKey = [clés primaire,..,nième clés primaire]
     * tabKeySearch = [valeur 1er clés primaire,.., valeur nième clés primaire]
     * objectModif = {colonne : val, colonne2 : val2, ...} non clé primaire
     * UPDATE films SET genre = 'Dramatique' WHERE genre = 'Drame';
    */
    update(tableName,tabKey, tabKeySearch, objectModif ){
        return new Promise((resolve, reject) => {
            var request = 'UPDATE '+tableName+' SET ';
           
            var tabValues = []
            var i = 1;
            for (const [key, value] of Object.entries(objectModif)) {
                request += "\""+key+"\" = $"+i+",";   // "colonne" = $1,
                tabValues.push(value)
                i++;
            }

            request = request.substr(0,request.length -1) + " WHERE" // enlève la dernière virgule

            for (let j=0;j<tabKey.length;j++){
                request += " \""+tabKey[j]+"\" = $"+(i+j) + " AND";
                tabValues.push(tabKeySearch[j]);
            }

            request = request.substr(0,request.length -3)+"RETURNING *;" // enlève le AND

            const query = {

                name: 'update-générique-'+tableName, // réquête préparer
                text: request,
                values: tabValues,
              }

            this.client.query(query, function(error, results) {
                if (error) {
                    console.log(error)
                    reject(Error.CONNECTION_ERROR);
                    return;
                }
                else if(results !== undefined && results.rows !== undefined &&  results.rows.length > 0 ) {
                    resolve(results.rows[0])
                } else {
                    // pas de résultat
                    reject(Error.NO_RESULTS);
                }
            });
        });
    }
    /*
     * tablename = nom de la table du model fil au model générique
     * tabKey = [clés primaire,..,nième clés primaire]
     * tabKeySearch = [valeur 1er clés primaire,.., valeur nième clés primaire]
     */
    delete(tableName, tabKey, tabKeySearch){
        return new Promise((resolve, reject) => {
            var request = 'DELETE FROM '+tableName+' WHERE';
            for (let i=0;i<tabKey.length;i++){
                request += " \""+tabKey[i]+"\" = $"+(i+1);
            }

            const query = {
                name: 'delete-générique', // réquête préparer
                text: request,
                values: tabKeySearch,
              }

            this.client.query(query, function(error, results) {
                if (error) {
                    reject(Errors.CONNECTION_ERROR);
                    return;
                } else {
                    resolve("good");
                }
            });
        });
    }
}