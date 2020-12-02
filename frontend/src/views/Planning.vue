<template>
  <div id="planning">
    <h1 id="title">Planning</h1>
    <b-table striped hover :items="items" :fields="fields" :bordered="true" :tdAttr="('50px', 'heigth', item)" ></b-table>
    <b-row>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="center"
          size="sm"
          class="my-0"
        ></b-pagination>
    </b-row>
  </div>
</template>

<script>
    //https://bootstrap-vue.org/docs/components/table <= Voir ici 

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
        ],
        currentPage: 1,
        perPage: 5,
        totalRows: 1,
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