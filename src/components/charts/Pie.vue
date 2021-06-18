<template>
  <div id="chart">
    <div v-if="Object.keys(data).length === 0">No data</div>
    <div v-else>
      <apexchart
        type="pie"
        width="350"
        :options="chartOptions"
        :series="initialSeries"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  name: "chartPie",
  components: {
    apexchart: VueApexCharts,
  },
  props: ["data"],
  computed: {
    chartOptions() {
      return {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: Object.keys(this.data),
        legend: {
          show: false,
        },
      };
    },
    initialSeries() {
      return Object.values(this.data);
    },
  },
};
</script>
