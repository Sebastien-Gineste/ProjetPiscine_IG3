exports.encode = (token,id) => {
    var tokenCoded = token.split(".");
    tokenCoded[2] = "ν"+id+"υ"+tokenCoded[2];
    return tokenCoded[1]+"."+tokenCoded[0]+"."+tokenCoded[2];
  };
  
exports.decode = (token) => {
    var tokenCoden = token.split(".");
    var idS = tokenCoden[2].indexOf("υ");
    var id = tokenCoden[2].slice(1, idS);
    return {id : id,token : tokenCoden[1]+'.'+tokenCoden[0]+'.'+tokenCoden[2].substr(idS+1,tokenCoden[2].length)}
  }