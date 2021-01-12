const Evenement = require('../models/evenement');
const Creneaux = require('../models/creneau');
const participe = require('../models/participe')
const errorModel = require("../models/model");
const Participe = require('../models/participe');

function getIdE(req){
    return req.baseUrl.split("/")[3];
}

//A faire
exports.selectAll = (req, res, next) => {
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    new Creneaux().selectAll(idE).then((results) => {
        res.status(200).json({creneaux : results})
    }).catch((error) => {
        switch(error) {
          case Error.NO_RESULTS:
              console.log('Pas de données dans cette table.');
              res.status(400).send("Pas de créneau encore")
              break;
          default : 
              console.log('service indispo.');
              res.status(400).json({ error })
              break;
        }
    })
};

exports.selectAllWithProf = (req, res, next) => {
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    var tabInfoProf = req.params.nom.split("-")
    if(tabInfoProf.length == 2){
        new Creneaux().selectAllWhereJury(idE,tabInfoProf).then((results) => {
            res.status(200).json({creneaux : results})
        }).catch((error) => {
            switch(error) {
              case Error.NO_RESULTS:
                  console.log('Pas de données dans cette table.');
                  res.status(400).send("Pas de créneau encore")
                  break;
              default : 
                  console.log(error)
                  console.log('service indispo.');
                  res.status(400).json({ error })
                  break;
            }
        })
    }
    else{
        res.status(400).json( "Erreur params" )
    }
};
//A faire
exports.selectAllSalle = (req, res, next) => {
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait')
};

//A faire
exports.save = (req, res, next) => {
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    console.log(req.body)
    const creneau = {
        date : req.body.date,
        numEvenement :idE,
        idGroupe: req.body.groupe,
        salle: req.body.salle,
        heureDebut : req.body.heureTotal
    };
    console.log(creneau)
    new Creneaux().save(creneau)
    .then((creneau) => res.status(201).json({ message: 'Creneau créé !', data : creneau }))
    .catch(error => res.status(400).json({ error }));
};

//A faire
exports.select = (req, res, next) => {
    console.log(req.params.id)
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait')
};

//A faire (tâche de Cécile)
/* Doit vérifier s'il n'a pas déjà un groupe sur un autre créneau / Si oui : le supprime
 * Doit vérifier si la date limite de réservation n'est pas terminer
 * Modifie le groupe du créneau
 * return {otherCreneau : idAncienCreneau (null sinon)}
 */
exports.updateCreneau = (req,res, next) =>{
    console.log(req.params.idC)
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('Pas encore fait')
}

exports.update = (req, res, next) => {
    console.log(req.params.idC)
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    console.log(req.body)
    if(req.body.type == "update"){ // update heure ou date
        new Creneaux().update([req.params.idC],{date : req.body.date, heureDebut : req.body.heureDebut})
        .then((creneau) => res.status(200).json({ message: 'Creneau modifier !', data : creneau }))
        .catch(error => res.status(400).json({ error }));
    }
    else if(req.body.type == "salle"){ // salle
        new Creneaux().update([req.params.idC],{salle : req.body.salle})
        .then((creneau) => res.status(200).json({ message: 'Creneau modifier !', data : creneau }))
        .catch(error => res.status(400).json({ error }));
    }
    else{ // jury
        if(req.body.jury[0]){
            new Participe().verifJury(idE,req.params.idC).then((nb)=>{
                if(nb > 0){
                    new Participe().deleteJury(idE,req.params.idC).then((results)=>{ // supprime les anciens jury avant de mettre les nouveaux
                        new Participe().saveJury(idE,req.params.idC,req.body.jury).then((creneau)=>{
                            res.status(200).json({ message: 'Creneau modifier !', data : creneau })
                        })
                        .catch((error) => {
                            console.log(error)
                            res.status(400).json({ error })
                        });
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(400).json({ error })
                    });
                }
                else{
                    new Participe().saveJury(idE,req.params.idC,req.body.jury).then((creneau)=>{
                        res.status(200).json({ message: 'Creneau modifier !', data : creneau })
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(400).json({ error })
                    });
                }
            })
            .catch((error) => {
                console.log(error)
                res.status(400).json({ error })
            });
        }   
    }
};

//A faire
exports.delete = (req, res, next) => {
    console.log(req.params.idC)
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    new Creneaux().delete(req.params.idC,idE).then((results) => {
        console.log(results)
        res.status(200).json({ message : results})
    }).catch((error) => {
        console.log(error);
        res.status(400).json({ error })
    })
};



