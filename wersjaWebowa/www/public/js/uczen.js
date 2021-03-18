class StudentManipulation extends PanelManipulation{
    constructor(){
        super();
    }

    getData(val) {
        this.userActivity;
        fetch("/api/aktywnosci?method=data", { method: "get" }).then(res => {
            res.text().then(v => {
                val(JSON.parse(v));
            });
        });
    }

    panelFetch(elem) {
        fetch(`/user/panelElem/ucz/${elem}`, {
            method: 'GET'
        }).then(res => {
            res.text().then(v => {
                this.rightCornerControler(v);
                if(elem == "mySummary"){
                    this.getData(val=>{
                        this.charts(val);
                    });
                }
            });
        }).catch(err => {
            console.log(err);
        })
    }
}

rc = new StudentManipulation();

class editActivityPanel{
    constructor(){
        this.getData(val=>{
            this.userActivity = val;
        });
    }

    set setData(val){
        this.date = val.parentElement.firstElementChild.innerText;
        this.hour = val.children[0].children[0].children[0].innerText.match(/(\d{2}\:\d{2})/g)[0];
        this.findActivity();
        this.insertData();
    }

    getData(val){
        this.userActivity;
        fetch("/api/aktywnosci?method=data", { method: "get" }).then(res => {
            res.text().then(v => {
                val(JSON.parse(v));
            });
        });
    }

    findActivity(){
        this.userActivity[this.date].forEach(elem => {
            if (elem.StartTime == this.hour) {
                this.dataToEdit = elem;
            }
        });
    }

    insertData(){
        for (let key in this.dataToEdit) {
            if (key == "Rodzaj") {
                document.querySelector(`select[name="Rodzaj"]`).value = this.dataToEdit[key];
            } else if (key != "Data" && key !="StartTime") {
                document.querySelector(`input[name="${key}"]`).value = this.dataToEdit[key];
            }
        }

        document.querySelector(`input[name="StaraData"]`).value = this.date;
        document.querySelector(`input[name="NowaData"]`).value = this.date;

        document.querySelector(`input[name="OldStartTime"]`).value = this.hour;
        document.querySelector(`input[name="NewStartTime"]`).value = this.hour;

        document.querySelector('input[name="EditSubmit"]').disabled = false;
    }

    areYouSure(){
        if (confirm(`Na pewno chcesz usunąć aktywność;\n
            z dnia ${this.date} \n
            o nazwie ${this.dataToEdit.Nazwa}`)){
            let doc = document.querySelectorAll('.delAct');
            doc[0].value = this.date;
            doc[1].value = this.hour;
                return true;
            }else{
                return false;
            }
    }
}

eap = new editActivityPanel();