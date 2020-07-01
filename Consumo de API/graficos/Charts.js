window.onload = () => {
    new Charts();
};

class Charts{

    constructor() {
        this.chartUnidade = this.criarChartUnidade();
        this.chartValor = this.criarChartValor();
        this.carregarDados().then(() => this.render());
    }

    carregarDados(){
        return axios.get("http://localhost:3000/produtos", axiosConfig).then(res => {
            this.prepararDados(res.data);
        }).catch(err => {
            alert("Faça o login!");
        });
    }

    prepararDados(dados){
        this.dadosUnidade = [
            dados.filter(dado => dado.unidade == "UN").length,
            dados.filter(dado => dado.unidade == "MG").length    
        ];

        this.labelProdutos = {};
        this.labelQuantidade = {};

        dados.forEach(element => {
            this.labelProdutos[element.produto] = this.labelProdutos[element.produto] + 1 || 5;
            this.labelQuantidade[element.produto] = element.quantidade;
        });

        console.log(this.labelQuantidade);
    }

    render() {
        //inserir dados no grafico
        this.chartUnidade.data.datasets[0].data = this.dadosUnidade;
        this.chartValor.data.labels = Object.keys(this.labelProdutos);
        this.chartValor.data.datasets[0].data = Object.values(this.labelQuantidade);

        //atualizar grafico
        this.chartUnidade.update();
        this.chartValor.update();
    }

    criarChartUnidade() {
        return new Chart(chartUnidade, {
            type: "bar",
            data: {
                labels: ["Unidades", "Miligramas"],
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

    criarChartValor() {
        return new Chart(chartValor, {
            type: "bar",
            data: {
                labels: [],
                datasets: [
                    {
                        label: "Total",
                        data: [],
                        backgroundColor:[
                            "rgba(207,0,207,0.5)","rgba(255,0,0,0.7)","rgba(0,255,0,0.7)","rgba(0,0,255,0.7)",
                            "rgba(0,0,0,0.5)","rgba(255,100,100,0.7)","rgba(0,255,0,0.7)","rgba(100,100,255,0.7)",
                        ]
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