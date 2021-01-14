const Evenement = require('../models/evenement');
const Creneaux = require('../models/creneau');
const participe = require('../models/participe')
const errorModel = require("../models/model");
const Participe = require('../models/participe');
const Groupe = require('../models/groupe_projet');

//Récupère l'id de l'événement où on modifie les créneaux
function getIdE(req){
    return req.baseUrl.split("/")[3];
}

//Sélectionne tous les créneaux associés à un évenemnt 
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
//Selectionne toutes les salles
exports.selectAllSalle = (req, res, next) => {
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    res.status(500).send('')
};

//Sauvegarde les informations du créneaux dans la BD
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

//Mise à jour d'un créneau lorsqu'un étudiant clique, on vérifie si l'étudiant a un groupe, si la date limite est dépassée ou si il a déjà un créneau
exports.updateCreneau = (req,res, next) =>{
    console.log(req.params.idC)
    var idE = getIdE(req)
    var dateActu = new Date();
    if(req.body.idGroupe === null || req.body.idGroupe == -1) { // pas d'idGroupe
        res.status(400).send("Vous n'avez pas de groupe");
    }
    else if (dateActu.getDate() > new Date(req.body.dateLimiteResa).getDate()){  //si la date limite est dépassée   
        res.status(400).send("La date limite est dépassée")
    }
    else{
        new Groupe().selectCreneauOfGroupe(req.body.idGroupe).then((response)=>{
            console.log(response)
            if(response === true){ // on peut ajouter le groupe
                new Creneaux().update([req.params.idC],{idGroupe:req.body.idGroupe})      //si toutes les conditions sont respectées, on enregistre le groupe
                .then(() => res.status(200).send("enregistré ! "))
                .catch(error => { console.log("ok"); console.log(error); res.status(400).json({ error })});
            }
            else{ // on doit supprimer le groupe
                new Creneaux().update([response[0].numCreneau],{idGroupe:null})
                .then(() => {
                    new Creneaux().update([req.params.idC],{idGroupe:req.body.idGroupe})      //si toutes les conditions sont respectées, on enregistre le groupe
                    .then(() => res.status(200).json({ otherCreneau: response[0].numCreneau}))
                    .catch(error => { console.log(error); res.status(400).json({ error })});                    
                })
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error)=>{
            console.log(error);
            res.status(400).send("Vous avez trop de groupe");
        })

    }
}

//Met à jour les informations su créneaux avec celles envoyées par l'utilisateur
exports.update = (req, res, next) => {
    console.log(req.params.idC)
    var idE = getIdE(req)
    console.log("id Evenement : "+idE);
    console.log(req.body)
    if(req.body.type == "update"){ // update heure ou date
        new Creneaux().update([req.params.idC],{date : req.body.date, heureDebut : req.body.heureDebut})
        .then((creneau) => res.status(200).json({ message: 'Creneau modifié !', data : creneau }))
        .catch(error => res.status(400).json({ error }));
    }
    else if(req.body.type == "salle"){ // salle
        new Creneaux().update([req.params.idC],{salle : req.body.salle})
        .then((creneau) => res.status(200).json({ message: 'Creneau modifié !', data : creneau }))
        .catch(error => res.status(400).json({ error }));
    }
    else{ // jury
        if(req.body.jury[0]){
            new Participe().verifJury(idE,req.params.idC).then((nb)=>{
                if(nb > 0){
                    new Participe().deleteJury(idE,req.params.idC).then((results)=>{ // supprime les anciens jury avant de mettre les nouveaux
                        new Participe().saveJury(idE,req.params.idC,req.body.jury).then((creneau)=>{
                            res.status(200).json({ message: 'Creneau modifié !', data : creneau })
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
                        res.status(200).json({ message: 'Creneau modifié !', data : creneau })
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

//Supprime un créneau
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



