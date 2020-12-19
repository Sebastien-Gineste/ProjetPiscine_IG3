
exports.makeToast = (composant, variant = null, titre, message) => {
    composant.$bvToast.toast(message, {
        title: titre,
        variant: variant,
        solid: true
    })
}

exports.formatDate = (d, type="normal")=>{
    const date = new Date(d)
    var dd = date.getDate(); 
    var mm = date.getMonth()+1;
    var yyyy = date.getFullYear(); 
    if(dd<10){dd='0'+dd} 
    if(mm<10){mm='0'+mm}
    return type=="normal" ? yyyy+'-'+mm+'-'+dd : dd+'/'+mm+'/'+yyyy
}
  
