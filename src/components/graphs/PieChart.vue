<script>
import { Pie } from 'vue-chartjs'
export default {
    extends: Pie,
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
        dark: Boolean
  },
  mounted () {
      this.colors = this.chartdata.map(() => this.getRandomColor())
      this.render()
  },
  methods: {
    render() {
    this.renderChart({
    labels: this.labels,
    datasets: [{
        label: this.title,
        data: this.chartdata,
        backgroundColor: [
            // '#FFC107',
            // '#17A2B8',
            // '#DC3545',
            ...this.colors
        ],
        borderWidth: 1
        }]
    }, {
        ...this.options,
        legend: {
            labels: {
                fontColor: 'black'
            }
        },
    })
    },
    getRandomColor() {
        var letters = '0123456789ABC'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 13)];
        }
        return color;
    },
  },
}
</script>