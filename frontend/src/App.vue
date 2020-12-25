<template>
  <div id="app">
    <nav-bar /> <!-- Menu  -->

    <div id="contain">
      <router-view/> <!-- Affiche la page du router sélectionner -->
    </div>

    <footer class="site-footer">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <h6>À propos</h6>
            <p class="text-justify">
              Ce site a été créé dans le cadre d'un projet universitaire. 
              <br>
              Voici donc une plateforme dédiée à la gestion de projets. 
              <br>
              Création, réservation et visualisation de soutenances, évenements et groupes sont disponibles sur ce site. 
              <br>
              <i>Ce bas de page est destiné aux professeurs si toutefois l'envie d'en savoir plus sur la réalisation de ce projet se faisait sentir.</i>
              </p>
          </div>

          <div class="col-xs-6 col-md-3">
            <h6>Les coulisses du projet</h6>
            <ul class="footer-links">
              <li><a href="https://trello.com/b/1wSk3836/backlog">Trello</a></li>
              <li><a href="https://drive.google.com/drive/folders/17I1erIMq8i1mWBqo9cgTSVqtHUBWOUzk?fbclid=IwAR1yQsT05Oae4nAkZmC7KXsVIXDbhwM1buU7F_ZQjNOVoXLGtingt41GoEQ">Google Drive</a></li>
            </ul>
          </div>
          
          <div class="col-xs-6 col-md-3">
            <h6>Les supers élèves</h6>
            <ul class="footer-links">
              <li>Cécile Destaing</li>
              <li>Loïs Anquetil</li>
              <li>Adnane El Abbas</li>
              <li>Sébastien Gineste</li>
              <li>Marwane Toury</li>
            </ul>
          </div>

        </div>
        <hr>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-6 col-xs-12">
            <p class="copyright-text">Copyright &copy; 2020-2021 Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>



  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";
import axio from "axios";
import store from './store/';

const axios = axio.create({
  withCredentials: true
})


export default {
  components: { NavBar },
  beforeMount(){
    if(store.getters.isUpdate){
      axios.post(`http://localhost:3000/api/Etudiant/VerifCo`).then((response) => {
        var user = {admin : response.data.admin, userId : response.data.userId};
        store.dispatch('connexion',user);
      })
      .catch((error) => { 
        if(error.response.status == 401){
          this.$store.dispatch('deconnexion');
        }
      });
    }
  }
}

</script>

<style lang="scss">
#contain{
  min-height : 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.site-footer
{
  background-color:#26272b;
  padding:45px 0 20px;
  font-size:15px;
  line-height:24px;
  color:#737373;
}
.site-footer hr
{
  border-top-color:#bbb;
  opacity:0.5
}
.site-footer hr.small
{
  margin:20px 0
}
.site-footer h6
{
  color:#fff;
  font-size:16px;
  text-transform:uppercase;
  margin-top:5px;
  letter-spacing:2px
}
.site-footer a
{
  color:#737373;
}
.site-footer a:hover
{
  color:#3366cc;
  text-decoration:none;
}
.footer-links
{
  padding-left:0;
  list-style:none
}
.footer-links li
{
  display:block
}
.footer-links a
{
  color:#737373
}
.footer-links a:active,.footer-links a:focus,.footer-links a:hover
{
  color:#3366cc;
  text-decoration:none;
}
.footer-links.inline li
{
  display:inline-block
}
.site-footer .social-icons
{
  text-align:right
}
.site-footer .social-icons a
{
  width:40px;
  height:40px;
  line-height:40px;
  margin-left:6px;
  margin-right:0;
  border-radius:100%;
  background-color:#33353d
}
.copyright-text
{
  margin:0
}
@media (max-width:991px)
{
  .site-footer [class^=col-]
  {
    margin-bottom:30px
  }
}
@media (max-width:767px)
{
  .site-footer
  {
    padding-bottom:0
  }
  .site-footer .copyright-text,.site-footer .social-icons
  {
    text-align:center
  }
}
.social-icons
{
  padding-left:0;
  margin-bottom:0;
  list-style:none
}
.social-icons li
{
  display:inline-block;
  margin-bottom:4px
}
.social-icons li.title
{
  margin-right:15px;
  text-transform:uppercase;
  color:#96a2b2;
  font-weight:700;
  font-size:13px
}
.social-icons a{
  background-color:#eceeef;
  color:#818a91;
  font-size:16px;
  display:inline-block;
  line-height:44px;
  width:44px;
  height:44px;
  text-align:center;
  margin-right:8px;
  border-radius:100%;
  -webkit-transition:all .2s linear;
  -o-transition:all .2s linear;
  transition:all .2s linear
}
.social-icons a:active,.social-icons a:focus,.social-icons a:hover
{
  color:#fff;
  background-color:#29aafe
}
.social-icons.size-sm a
{
  line-height:34px;
  height:34px;
  width:34px;
  font-size:14px
}
.social-icons a.facebook:hover
{
  background-color:#3b5998
}
.social-icons a.twitter:hover
{
  background-color:#00aced
}
.social-icons a.linkedin:hover
{
  background-color:#007bb6
}
.social-icons a.dribbble:hover
{
  background-color:#ea4c89
}
@media (max-width:767px)
{
  .social-icons li.title
  {
    display:block;
    margin-right:0;
    font-weight:600
  }
}

</style>