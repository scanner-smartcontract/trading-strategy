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
        initializeChart() {
            // Inisialisasi chart
            this.chart = LightweightCharts.createChart(this.$refs.chartContainer, {
                width: this.$refs.chartContainer.clientWidth,
                height: 600,
                layout: {
                    background: { color: '#1a1d23' },
                    textColor: 'rgba(255, 255, 255, 0.9)',
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false
                }
            });

            // Tambahkan candlestick series
            this.priceSeries = this.chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderUpColor: '#26a69a',
                borderDownColor: '#ef5350',
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350'
            });
        },

        loadMockData() {
            // Generate mock data
            const data = [];
            let price = 100;
            const now = Math.floor(Date.now() / 1000); // Dalam detik
            
            for(let i = 0; i < 200; i++) {
                const open = price;
                const high = open + Math.random() * 5;
                const low = open - Math.random() * 5;
                const close = low + (high - low) * Math.random();
                
                data.push({
                    time: now - (200 - i) * 60, // 1 menit interval
                    open: open,
                    high: high,
                    low: low,
                    close: close
                });

                price = close;
            }

            // Update chart dengan data
            this.priceSeries.setData(data);
            this.addIndicators(data);
        },

        addIndicators(data) {
            // Hitung Gaussian Channel
            const length = this.parameters.gcLength;
            const basis = [];
            const upper = [];
            const lower = [];
            
            for(let i = length; i < data.length; i++) {
                const slice = data.slice(i - length, i);
                const closes = slice.map(d => d.close);
                const mean = closes.reduce((a,b) => a + b) / length;
                const stdDev = Math.sqrt(
                    closes.map(x => Math.pow(x - mean, 2))
                          .reduce((a,b) => a + b) / length
                );
                
                basis.push({ time: data[i].time, value: mean });
                upper.push({ time: data[i].time, value: mean + stdDev * this.parameters.gcMultiplier });
                lower.push({ time: data[i].time, value: mean - stdDev * this.parameters.gcMultiplier });
            }

            // Tambahkan indikator ke chart
            this.basisSeries = this.chart.addLineSeries({
                color: '#2196f3',
                lineWidth: 1,
                title: 'Basis'
            });

            this.upperSeries = this.chart.addLineSeries({
                color: '#26a69a',
                lineWidth: 1,
                title: 'Upper Channel'
            });

            this.lowerSeries = this.chart.addLineSeries({
                color: '#ef5350',
                lineWidth: 1,
                title: 'Lower Channel'
            });

            this.basisSeries.setData(basis);
            this.upperSeries.setData(upper);
            this.lowerSeries.setData(lower);
        }
    }
}).mount('#app');
