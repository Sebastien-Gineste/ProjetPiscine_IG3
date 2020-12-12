const Evenement = require('../models/evenement');
const errorModel = require("../models/model");
const Promo = require('../models/promo');
const Creneau = require('../models/creneau');

//A faire
exports.selectAll = (req, res, next) => {
  res.status(500).send('Pas encore fait bla')
};

exports.save = (req, res, next) => {
  verifDateEvent(req.body).then((result) => {
    const event = result
    if(event === false){
      res.status(404).send('Problème lors de la création de l\'évenement')
    }
    else{
      new Evenement().save(event)
      .then((results) => {
        var heureMin = 8
        var heureMax = 19
        var tabCreneau = generateCreneaux(generateDateEvent(event.dateDebut,event.duree),event.dureeCreneau,results.numEvenement,heureMin,heureMax);
        new Creneau().generate(tabCreneau).then((newCrenau) => { // on génère les nouveaux créneaux
          res.status(201).json({ message: 'Evenement créé ! avec ses créneaux :)' })
        })
        .catch((error) => {
          console.log(error)
          res.status(400).json({ message : "problème lors de la génération des créneaux" })
        })
      })
      .catch(error => {
        console.log(error)
        res.status(400).json({ error })
      });
    }
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json({ message :  "problème avec la validité des données" });
  });
};

exports.select = (req, res, next) => {
  console.log(req.params.id)

  new Evenement().select([req.params.id]).then((results)=>{ 
    res.status(200).json(results[0])
  }).catch((error) => {
    switch(error) {
      case Error.NO_RESULTS:
          console.log('Pas de données dans cette table.');
          res.status(400).json({ error })
          break;
      default : 
          console.log('service indispo.');
          res.status(400).json({ error })
          break;
    }
  })
}

exports.update = (req, res, next) => {
  console.log("num Event : " +req.params.id)
  verifDateEvent(req.body).then((result) => { // vérifie les données 
    new Evenement().select([req.params.id]).then((resultsBD)=>{ // on sélectionne l'évenement dans la BD pour voir s'il existe
      const dataBD = resultsBD[0]
      const dataNew = { }

      for (var column in result){
        if(column != "dateDebut" && column != "dateLimiteResa" && dataBD[column] != result[column]){ // comparer les éléments de l'évenement 
          dataNew[column] = result[column]
        }
        if(column == "dateDebut" || column == "dateLimiteResa"){ // compare les dates en les mettant sous le même format
          if(formatDate(dataBD[column]) != result[column] ){
            dataNew[column] = result[column]
          }
        }
      }
      
      if(Object.keys(dataNew).length == 0){ // pas de modif 
        res.status(400).json({ message : "Pas de valeur à modifier" })
      }
      else{
        console.log(dataNew) // valeur à changer 
        new Evenement().update([req.params.id],dataNew)
        .then(() => {
          if(dataNew.hasOwnProperty("dateDebut") || dataNew.hasOwnProperty("dureeCreneau") || dataNew.hasOwnProperty("duree")){ // Il faut recréer des créneaux
            var dateDeb = dataNew.hasOwnProperty("dateDebut") ? dataNew.dateDebut : dataBD.dateDebut
            var durreC = dataNew.hasOwnProperty("dureeCreneau") ? dataNew.dureeCreneau : dataBD.dureeCreneau
            var durreE = dataNew.hasOwnProperty("duree") ? dataNew.duree : dataBD.duree
            var heureMin = 8
            var heureMax = 19
            var tabAncienceDate = generateDateEvent(dataBD.dateDebut,dataBD.duree)
    
            supprimeCreneaux(dateDeb, durreE ,durreC,dataBD.numEvenement,heureMin,heureMax,tabAncienceDate,true).then((result)=> {
              console.log(result)
              new Creneau().generate(result).then((results) => { // on génère les nouveaux créneaux
                res.status(200).json({ message: 'Evenement modifier ! Avec sa petite génération :) ' })
              })
              .catch((error) => {
                console.log(error)
                res.status(400).json({ message : "problème lors de la génération des créneaux" })
              })
            })
            .catch((error) => {
              console.log(error)
              res.status(400).json({ message : "problème lors de la suppression des créneaux" })
            })
          }
          else{
            res.status(200).json({ message: 'Evenement modifier !' })
          }
        
        })
        .catch(error => res.status(400).json({ error }));
      }

    }).catch((error) => {
      console.log(error)
      switch(error) {
        case Error.NO_RESULTS:
            console.log('Pas de données dans cette table.');
            res.status(400).json({ error })
            break;
        default : 
            console.log('service indispo.');
            res.status(400).json({ error })
            break;
      }
    })
  })
  .catch((error) => {
    console.log(error);
    res.status(400).json({ error });
  });
};

//A faire
exports.delete = (req, res, next) => {
  console.log(req.params.id)
  res.status(500).send('Pas encore fait')
};




/* fonction additionnel */

function supprimeCreneaux(dateDebut,dureeEvent,dureeCreneau,numEvent,heureMin, heureMax,tabOldDate, toutRedefinir){
  return new Promise((resolve, reject) => {

    var tabDate = generateDateEvent(dateDebut,dureeEvent) // nouvelle date de créneau

    if(toutRedefinir){ // on supprimer tout et on redinit tous
        new Creneau().deleteAll(numEvent).then(()=>{ // on supprime tout
          resolve(generateCreneaux(tabDate,dureeCreneau,numEvent,heureMin, heureMax)) // on redéfini
        })
        .catch((error)=> {
          console.log(error)
          reject(error)
        })
    }
    else{// supprimer les créneaux qui ne couvre plus l'évenement :
      
      new Creneau().deleteWhere(numEvent,tabDate).thent(()=>{
        // Ajouts des créneaux qui ne couvre pas les nouveaux jours de l'évenement
        tabDateAGenerer = getNewDate(tabOldDate,tabDate)
        resolve(generateCreneaux(tabDateAGenerer,dureeCreneau,numEvent,heureMin, heureMax))
      })
      .catch((error)=> {
        console.log(error)
        reject(error)
      })

    }
  })
}

// renvoie un tableau de date à générer - celles qui étaient déjà dans le tableau des anciennes date d'évenement  
function getNewDate(tDO,tDN){
  for(let i = 0;i<tDN.length;i++){
    if(tDO.indexOf(tDN[i]) != -1){ // on l'enlève : pas besoin de le regénerer
      tDN.splice(i, i+1);
      i--
    }
  }
  return tDN
}


function generateCreneaux(tabDate,dureeCreneau,numEvent,heureMin, heureMax){ // génére les créneaux
  const heureDebut = heureMin
  const heureFin = heureMax
  const tabCreneau = [] // tableau qui va contenir tous les créneaux générer : {dateCreneau : ...., heureDebut : ...., numEvent : numEvent}
  var numjour = 0

  while(tabDate.length > numjour){ // tant qu'il reste des jours pour mettre les créneaux
    dateActu = new Date(tabDate[numjour]) // on passe au jour suivant
    var jourActu = dateActu.getDay() 
    if(jourActu == 0 ||jourActu == 6 ){ // samedi ou dimanche 
    }
    else{
      var heureDebutApm = (dureeCreneau == "1_heure" ? 14 : 14.25)
      var hCreneau = (dureeCreneau == "1_heure" ? 1.25 : 1.75)
      var isPossibleSetNewCreneau = true //(dureeCreneau == "1_heure" ? 8: 5)
      var nbcreneauMatin = 0//(dureeCreneau == "1_heure" ? 4: 3)
      var i = 0
      while(isPossibleSetNewCreneau){
        if(heureDebut+(i*hCreneau) > 11.5 && nbcreneauMatin == 0){ // si le créneaux commencer après 11h30 (11h45)
          nbcreneauMatin = i
        }
        var heure = (heureDebut+(i*hCreneau) <= 11.5 ? heureDebut+(i*hCreneau) : heureDebutApm+((i-nbcreneauMatin)*hCreneau))
        if(heure+hCreneau <= heureFin){ // le créneau ne fini pas trop tard
          tabCreneau.push({date : formatDate(dateActu), heureDebut : heure,numEvenement :numEvent })
        }
        else{
          isPossibleSetNewCreneau = false
        }
        i++
      }
    }
    numjour++
    
  }

  return tabCreneau
}


function generateDateEvent(DateDebut,DureeE){
  var tabDate = []
  var i = 0
  var dateActu = new Date(DateDebut)
  while(i < DureeE){
    var jourActu = dateActu.getDay() 
    if(jourActu == 0 ||jourActu == 6 ){ // samedi ou dimanche 
      i--
    }
    else{
      tabDate.push(formatDate(dateActu))
    }
    dateActu.setDate(dateActu.getDate()+1) // on passe au jour suivant
    i++
  }
  return tabDate
}

function formatDate(d){ // met le format d'une date sous la forme anneé-mois-jours
  const date = new Date(d)
  var dd = date.getDate(); 
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear(); 
  if(dd<10){dd='0'+dd} 
  if(mm<10){mm='0'+mm}
  return yyyy+'-'+mm+'-'+dd
}

function verifDateEvent(EvtFront){  // Vérifie les données lors de la création ou la modification d'un évenement 
    return new Promise((resolve, reject) => {
      
      var dataEvent = {}

      if(EvtFront.nomE.length > 0){
        dataEvent.nomEvenement = EvtFront.nomE
      }

      const today = new Date()
      const dateD = new Date(EvtFront.DateDeb);
      const dateL = new Date(EvtFront.DateLim);
      if(dateD >= today && dateD >= dateL){
        dataEvent.dateDebut = EvtFront.DateDeb
      }
      if(dateL.getDate() >= today.getDate()){
        dataEvent.dateLimiteResa = EvtFront.DateLim
      }

      if(EvtFront.DureeE >= 1){
        dataEvent.duree = EvtFront.DureeE
      }

      if(EvtFront.DureeS == "1_heure" || EvtFront.DureeS == "1_heure_30" ){
        dataEvent.dureeCreneau = EvtFront.DureeS
      }

      if(EvtFront.nbJury >= 1){
        dataEvent.nombreMembreJury = EvtFront.nbJury
      }

      new Promo().select([EvtFront.Promo]).then(()=>{ // vérifie l'existance de la promo
        dataEvent.anneePromo = EvtFront.Promo
        if(Object.keys(dataEvent).length == 7 ){ // tout c'est bien passé
          resolve(dataEvent)
        }
        reject(false);
      })
      .catch((error) => {console.log("error");reject(false);});

    });

}