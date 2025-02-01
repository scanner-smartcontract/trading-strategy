// script.js
const { createApp } = Vue;

createApp({
    data() {
        return {
            parameters: {
                gcLength: 20,
                gcMultiplier: 2.0,
                rsiLength: 14,
                stochLength: 14,
                positionSize: 100
            },
            chart: null,
            priceSeries: null,
            upperSeries: null,
            lowerSeries: null,
            basisSeries: null
        }
    },
    mounted() {
        this.initializeChart();
        this.loadMockData();
    },
    methods: {
