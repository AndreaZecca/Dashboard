<script>
import { Line } from "vue-chartjs";

export default {
    extends: Line,
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
        beginAtZero: Boolean
    },
    mounted() {
        this.render()
    },
    methods: {
        render(){
            this.renderChart(
                {
                    labels: this.labels,
                    datasets: [
                        {
                            label: this.title,
                            data: this.chartdata,
                            borderColor: "#3e95cd",
                            fill: false
                        }
                    ]
                },
                {
                    ...this.options,
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: 'black',
                                beginAtZero: this.beginAtZero
                            },
                            gridLines: {
                                display: true
                            }
                        }],
                        xAxes: [{
                            ticks: {
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
                }
            );
        }
    }
};
</script>