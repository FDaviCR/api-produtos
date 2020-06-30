window.onload = () => {
    new Valor();
};

class Valor{

    constructor() {
        this.chartValor = this.criarChartValor();
        this.carregarDados().then(() => this.render());
    }

    carregarDados(){
        return axios.get("http://localhost:3000/produtos", axiosConfig).then(res => {
            this.prepararDados(res.data);
        }).catch(err => {
            alert("Algo errado...", err);
        });
    }

    prepararDados(dados){
        this.dadosValor = [
            dados.filter(dado => dado.unidade == "UN").length,
            dados.filter(dado => dado.unidade == "MG").length    
        ];
        this.dadosProdutos = [
            dados.produto
        ];
        console.log(this.dadosProdutos);
    }

    render() {
        //inserir dados no grafico
        console.log(this.dadosValor);
        this.chartValor.data.datasets[0].data = this.dadosValor;
        this.chartValor.labels = this.dadosProdutos;

        //atualizar grafico
        this.chartValor.update();
    }

    criarChartValor() {
        return new Chart(chartValor, {
            type: "bar",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Total",
                        data: [],
                        backgroundColor:["rgba(29,0,207,0.7)","rgba(255,0,0,0.7)"]
                    }
                ]
            },
            options: {
                scales: {
                    yAxes:[
                        {
                            ticks:{
                                beginAtZero: true
                            }
                        }
                    ]
                },
                title: {
                    display: true,
                    text: "Totais por tipo de unidade"
                },
                legend: {
                    display: false
                }
            }
        });
    }
}