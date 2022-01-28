<script>
import { Bar } from 'vue-chartjs'
export default {
    extends: Bar,
    props: {
        title:{
            type: String
        },
        labels:{
            type: Array
        },
        chartdata: {
            type: Array,
            default: null
        },
        options: {
            type: Object,
            default: null
        },
    },
    data: () => {
        return {
            colors: [],
            legendColor: 'white',
        }
    },
    methods: {
        getRandomColor() {
            var letters = '0123456789ABC'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 13)];
            }
            return color;
        },
        render() {
            this.renderChart({
                    labels: this.labels,
                    datasets: [{
                        label: this.title,
                        data: this.chartdata,
                        backgroundColor: [
                            // '#17A2B8',
                            // '#28A745',
                            // '#FFC107',
                            // '#DC3545',
                            ...this.colors
                        ],
                        borderWidth: 1
                }]}
                , { ...this.options, 
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: 'black'
                            },
                            gridLines: {
                                display: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                beginAtZero: true,
                                fontColor: 'black'
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },
                    legend: {
                        labels: {
                            fontColor: 'black'
                        }
                    },
                })
        }
    },
    mounted () {
        this.colors = this.chartdata.map(() => this.getRandomColor())
        this.render()
    },
}
</script>