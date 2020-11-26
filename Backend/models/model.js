const client = require("../config/conf")

const Errors = {
    NO_RESULTS: new Error('No results'),
    BAD_REQUEST: new Error('Bad request'),
    CONNECTION_ERROR: new Error('Unable to query database'),  
  }

module.exports = class Model{

    constructor(){
        this.client = client;
    }

    save (tableName){
        console.log(tableName)
        return true;
    };

    select(){

    }

    selectAll(tableName){
        return new Promise((resolve, reject) => {
            this.client.query('SELECT * FROM '+tableName, function(error, results) {
                if (error) {
                    console.log(error)
                    reject(Error.CONNECTION_ERROR);
                    return;
                }
                if(results[0] !== undefined) {
                    resolve(results)
                } else {
                    console.log(this)
                    reject(Error.NO_RESULTS);
                }
            });
        });
    }

    update(){

    }

    delete(){

    }
}