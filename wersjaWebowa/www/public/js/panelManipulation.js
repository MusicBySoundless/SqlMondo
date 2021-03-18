class PanelManipulation {
    constructor() {
        let defCorn = document.createElement("div");
        defCorn.className = "right-corner";
        this.defCorn = defCorn;
    }

    checkDivElem(elem, callback) {
        let tmp = document.createElement("div");
        tmp.innerHTML = elem;
        for (const [key, value] of Object.entries(tmp.children)) {
            callback(value);
        }
    }

    rightCornerControler(elem) {
        this.checkDivElem(elem, val => {
            if (val.className == "right-corner") {
                this.rightCornerInsert(1, val);
            } else {
                this.rightCornerInsert(0);
                this.contentInsert(val);
            }
        });
    }

    rightCornerInsert(setStatus, elem = this.defCorn) {
        sessionStorage.setItem('right-corner-status', setStatus);
        document.querySelector('.right-corner').replaceWith(elem);
    }

    contentInsert(elem) {
        document.querySelector('.content').replaceWith(elem);
    }
    chartsHold(){
        this.diagrams = document.querySelector('.diagrams-container');
    }

    chartsClear(){
        if(this.a1Chart ){
            this.a1Chart.destroy();
            this.a2Chart.destroy();
            this.a3Chart.destroy();
            this.a5Chart.destroy();
            this.aChart.destroy();
        } 
    }

    charts(val) {
        let data = val;
        let rodzaj = [];
        let kilometry = [];
        
        
        function retCzasTrwania(){
            let czasTrwania = new Array(4).fill(0);
            function activTime({ StartTime, EndTime }) {
                let st = new Date(`2012 10 2, ${StartTime}`).getTime();
                let end = new Date(`2012 10 2, ${EndTime}`).getTime();
                let diff = (end - st) / 1000;
                diff /= 3600;
                return diff
            }
            for (let key in data) {
                data[key].forEach(elem => {
                    let a = activTime(elem);
                    switch (elem.Rodzaj) {
                        case "Bieg":
                            czasTrwania[0] += a;
                            break;
                        case "Jazda na rowerze":
                            czasTrwania[2] += a;
                            break;
                        case "Spacer":
                            czasTrwania[1] += a;
                            break;
                        case "Inna":
                            czasTrwania[3] += a;
                            break;
                    }
                });
            }
            czasTrwania = czasTrwania.map(x => x.toFixed(1));
            return czasTrwania;
        }
            
        let myChart = document.querySelector("#myChart");
        this.aChart = new Chart(myChart, {
            type: 'doughnut',
            data: {
                labels: ["Bieg", "Spacer", "Jazda na rowerze", "Inne"],
                datasets: [{
                    label: "hahah",
                    data: retCzasTrwania(),
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderwidth: 1,
                    borderColor: '#777',
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Łączne czasy aktywności (w godzinach)',
                    fontSize: 20
                },
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        }
        );


        function liczenieIlosciAktywnosci(){
            let ilosc = new Array(4).fill(0);

            for(let key in data){
                data[key].forEach(({Rodzaj})=>{
                    switch (Rodzaj) {
                        case "Spacer": 
                            ilosc[1] +=1;
                        break;
                        case "Bieg":
                            ilosc[0] +=1;
                        break;
                        case "Jazda na rowerze":
                            ilosc[2] +=1;
                        break;
                        case "Inna":
                            ilosc[3] +=1;
                        break;
                    }
                })
            }
            return ilosc;
        }

        let myChart1 = document.getElementById("myChart1").getContext("2d");
        this.a1Chart = new Chart(myChart1, {
            type: 'doughnut',
            data: {
                labels: ["Bieg", "Spacer", "Jazda na rowerze", "Inna"],
                datasets: [{
                    label: 'odległość (km)',
                    data: liczenieIlosciAktywnosci(),
                    backgroundColor: [        
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderwidth: 1,
                    borderColor: '#777'
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Liczba aktywności',
                    fontSize: 20
                },
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        });

        function ostatnieSiedemDniKrokowKilometrow(aktywnosc) {
            let dates = ostatnieSiedemDni();
            let krokiLubKilometry = new Array(7).fill(0);
            let i = 0;

            let ostatnieAktywnosci = [];
            for (let key in data) {
                ostatnieAktywnosci.push(key);
            }

            dates.forEach((value, index) => {
                if (ostatnieAktywnosci.includes(value)) {
                    data[value].forEach(b => {
                        krokiLubKilometry[index] += parseInt(b[aktywnosc]);
                    });
                } else {
                    krokiLubKilometry[index] = 0;
                }
            });

            return krokiLubKilometry = krokiLubKilometry.map(x => x.toFixed(1));
        }

        let myChart2 = document.getElementById("myChart2").getContext("2d");
        this.a2Chart = new Chart(myChart2, {
            type: 'bar',
            data: {
                labels: ostatnieSiedemDni(),
                datasets: [{
                    label: 'liczba kroków',
                    data: ostatnieSiedemDniKrokowKilometrow("Kroki"),
                    backgroundColor: 'rgba(105, 103, 250, 0.5)'
                },{
                    label: "liczba kilometrów",
                    backgroundColor: 'rgba(240, 123, 64, 0.5)',
                    data: ostatnieSiedemDniKrokowKilometrow("Kilometry")
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Liczba kroków i kilometrów w ostanich 7 dniach',
                    fontSize: 20
                },
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        });


        function ostatnieSiedemDni(){
            const options = {year: "numeric", month: "numeric", day: "numeric"};
            const dates = [...Array(7)].map((_, i) => {
                const d = new Date()
                d.setDate(d.getDate() - i)
                return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2) }-${('0' + d.getDate()).slice(-2)}`;
            })
            return dates;
        } 

        function ostatnieSiedemDniAktywnosci(aktywnosc){
            function activTime({ StartTime, EndTime }) {
                let st = new Date(`2012 10 2, ${StartTime}`).getTime();
                let end = new Date(`2012 10 2, ${EndTime}`).getTime();
                let diff = (end - st) / 1000;
                diff /= 3600;
                return diff
            }

            let dates = ostatnieSiedemDni();
            let czasTrwania = new Array(7).fill(0);
            let i = 0;

            let ostatnieAktywnosci = [];
            for(let key in data){
                ostatnieAktywnosci.push(key);
            }
            
            dates.forEach((value,index) =>{
                if (ostatnieAktywnosci.includes(value)) {
                    data[value].forEach(b =>{
                        if(b.Rodzaj == aktywnosc){
                            czasTrwania[index] += activTime(b);
                        }
                    });
                } else {
                    czasTrwania[index] = 0;
                }
            });
    
            return czasTrwania = czasTrwania.map(x => x.toFixed(1));
        } 

        let myChart3 = document.getElementById("myChart3").getContext("2d");
        this.a3Chart = new Chart(myChart3, {
            type: "bar",
            data:{
                
                labels: ostatnieSiedemDni(),
                datasets:[
                    {
                        label: "Bieg",
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        data: ostatnieSiedemDniAktywnosci("Bieg")
                    },
                    {
                        label: "Spacer",
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        data: ostatnieSiedemDniAktywnosci("Spacer")
                    },
                    {
                        label: "Jazda na rowerze",
                        backgroundColor: 'rgba(255, 206, 86, 0.5)',
                        data: ostatnieSiedemDniAktywnosci("Jazda na rowerze")
                    },
                    {
                        label: "Inna",
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        data: ostatnieSiedemDniAktywnosci("Inna")
                    }
                ]
            },
            options: {
                title:{
                    display: true,
                    text:"Czas aktywności w ostatnich 7 dniach (w godzinach)",
                    fontSize: 20
                },
                legend: {
                    position: 'right'
                },
                scales: {
                    title:"godziny",
                    yAxes: [{
                        ticks: {
                            min: 0
                        }
                    }]
                }
            }
        });

        let miesiace = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrześień', 'październik', 'listopad', 'grudzień'];
        kilometry = new Array(12).fill(0);

        let kroki = new Array(12).fill(0);

        for(let key in data){
            let date = new Date(key);
            let miesiac = new Intl.DateTimeFormat('pl-PL', { month: 'long' }).format(date);
            if(date.getFullYear() == new Date().getFullYear()){
                data[key].forEach(val => {
                    kilometry[miesiace.indexOf(miesiac)] += parseInt(val.Kroki);
                    kroki[miesiace.indexOf(miesiac)] += parseInt(val.Kilometry);
                });
            } 
        }
        
        let myChart5 = document.getElementById("myChart5").getContext("2d");
        this.a5Chart = new Chart(myChart5, {
            type: 'bar',
            data: {
                labels: miesiace,
                datasets: [{
                    label: 'liczba kroków',
                    data: kilometry,
                    backgroundColor: 'rgba(105, 103, 250, 0.5)',
                },{
                    label: "liczba kilometrów",
                    backgroundColor: 'rgba(240, 123, 64, 0.5)',
                    data: kroki
                }]
            },
            options: {
                title: {
                    display: true,
                    text: `Liczba kroków i kilometrów w ${new Date().getFullYear()}`,
                    fontSize: 20
                },
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        });
    }
}