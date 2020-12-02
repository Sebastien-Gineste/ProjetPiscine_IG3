<template>
  <div id="planning">
    <h1 id="title">Planning</h1>
    <b-table striped hover :items="items" :fields="fields" :bordered="true" :tdAttr="('50px', 'heigth', item)" ></b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // Note `isActive` is left out and will not appear in the rendered table
        fields: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        items: [
          { isActive: true, Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""}, 
          { isActive: true, Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""},
          { isActive: true,  Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""},
          { isActive: true,  Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""},
          { isActive: true,  Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""},
          { isActive: true,  Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""},
          { isActive: true,  Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""},
          { isActive: true,  Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""},
          { isActive: true,  Lundi : "",Mardi : "",Mercredi : "",Jeudi : "",Vendredi : ""}
        ]
      }
    }
  }
</script>

<style lang="scss">
    #planning{
        margin : 2%;
    }
    #title{
        margin: 2%;
    }

</style>