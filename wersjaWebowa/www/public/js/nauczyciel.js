class TeacherManipulation extends PanelManipulation{
    constructor(){
        super();
    }
    panelFetch(elem) {
        fetch(`/user/panelElem/naucz/${elem}`, {
            method: 'GET'
        }).then(res => {
            res.text().then(v => {
                this.rightCornerControler(v);
            });
        }).catch(err => {
            console.log(err);
        })
    }
    
    getStudentData(code,val){
        fetch(`/api/aktywnosci?userID=${code}&method=data`, {
            method: "GET",
        }).then(res => {
            res.text().then(v => {
               val(JSON.parse(v));
            });
        });
    }
}

rc = new TeacherManipulation();

function classEdition(kodKlasy) {
    if (window.event.target.tagName != 'INPUT'){
        fetch(`/api/getveryclass?classCode=${kodKlasy}`, {
            method: 'GET'
        }).then(res => {
            res.text().then(v => {
                rc.rightCornerControler(v);
            });
        });
    }
}

async function copyValue(val){
    const el = document.createElement('textarea');
    el.value = val;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function getStudents({ textContent }, what = "student") {
    fetch(`/api/listauczniow?classCode=${textContent}`, {
        method: "GET"
    }).then(res => {
        res.text().then(v => {
            if (v.length != 0) {
                v = JSON.parse(v);
                let inputer = document.querySelector(`select[name='summary${what}']`);
                inputer.innerHTML = sessionStorage.getItem(`summary${what}select`);
                inputer.innerHTML = '<option disabled selected value style="display: none;"></option>';
                v.forEach(val => {
                    let code = val.pop();
                    inputer.innerHTML += `<option value="${code}">${val.join(" ")}</option>`;
                });
            }
        });
    });
}

function a(e) {
    rc.chartsHold();
    e.preventDefault();
    let code = e.target[1].value;
    // fetch(`/api/aktywnosci?userID=${code}&method=panel`, {
    //     method: "GET",
    // }).then(res=>{
    //     res.text().then(v=>{
            rc.getStudentData(code,val=>{
                rc.chartsClear();
                rc.charts(val);
            });
    //         let div = document.createElement('div');
    //         div.innerHTML = v;
    //         div.removeChild(div.lastChild);
    //         div = div.firstChild.outerHTML;
            
    //         rc.rightCornerControler(div);
    //     });
    // });
    
    return false;
}

let secretDiv = document.createElement('div');
secretDiv.setAttribute('class', 'content');
secretDiv.innerHTML = ``;

function b(e){
    e.preventDefault();
    let code = e.target[0].value;
    fetch(`/api/aktywnosciklasy/${code}`, {
        method: "GET",
    }).then(res => {
        res.text().then(v => {
            rc.charts(JSON.parse(v));
        });
    });

    return false;
}