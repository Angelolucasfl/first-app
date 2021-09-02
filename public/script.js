let cadastro;


function update(index,link){
    let tds = document.querySelectorAll(`td[data-index-row='${index}']`);
    let spans = document.querySelectorAll(`td[data-index-row='${index}'] > span`);
    let inputs = document.querySelectorAll(`td[data-index-row='${index}'] > input`);

    let lenTds = tds.length-1; 
    let linkUpdate = tds[lenTds-1]; 
    let linkRemove = tds[lenTds];

    let lenInputs = inputs.length; 

    let button = inputs[lenInputs-1]; 



    linkUpdate.className='hidden';
    linkRemove.className='hidden';
    tds[lenTds-2].className='show'; 

     
    for(let cont=0;cont<spans.length;cont++){
        if(spans[cont].className=="show"){
            spans[cont].className="hidden";
        } else{
            spans[cont].className="show";
        }
    }
    
    for(let cont=0;cont<inputs.length;cont++){
        if(inputs[cont].className=="hidden"){
            inputs[cont].className="show";
        }
    }

    
    button.addEventListener('click',()=>{
        const http = new XMLHttpRequest(); 
        const url=link; 
        let data = {id:"",name:"",email:"",address:"",age:"",heigth:"",vote:""};
        let dataToSend;



        http.open("POST",link,true); 
        http.setRequestHeader('Content-Type','application/json'); 
         
        for(let cont=0;cont<inputs.length;cont++){ 
            if(inputs[cont].disabled==true){
                inputs[cont].disabled=false;
            } else inputs[cont].disabled=true;
        }

        data.id = index; 
        data.name = inputs[0].value;
        data.email = inputs[1].value;
        data.address = inputs[2].value;
        data.age = inputs[3].value;
        data.heigth = inputs[4].value;
        data.vote = inputs[5].value;

        dataToSend = JSON.stringify(data); 

        http.send(dataToSend);

        http.onload = ()=>{ 

            if (http.readyState === 4 && http.status === 200) { 
                for(let cont=0;cont<spans.length;cont++){
                    if(spans[cont].className=="hidden"){
                        spans[cont].innerHTML = inputs[cont].value;
                        spans[cont].className="show";
                    } else{
                        spans[cont].className="hidden";
                    }
                }

               
                for(let cont=0;cont<inputs.length;cont++){
                    if(inputs[cont].className=="show"){
                        inputs[cont].className="hidden";
                        if(inputs[cont].disabled==false){
                            inputs[cont].disabled=true;
                        }
                    }
                }

                linkUpdate.className='show';
                linkRemove.className='show';
                tds[lenTds-2].className='hidden';
            } else {

                console.log("Ocorreu erro no processamento dos dados no servidor: ",http.responseText);
            }     
        }

    });  

}

function remove(index,_name,link){ 

    const http = new XMLHttpRequest(); 
    const url=link;

    http.open("POST",link,true); 
    http.setRequestHeader('Content-Type','application/json'); 
    dataToSend = JSON.stringify({name:_name}); 

    http.send(dataToSend);

    http.onload = ()=>{ 
        
        let tr = document.querySelector(`table#list > tbody > tr[data-index-row='${index}']`);

        if (http.readyState === 4 && http.status === 200) {
            tr.remove();
            console.log(`Item ${index} removido com sucesso!`);

        } else {
            console.log(`Erro durante a tentativa de remoção do usuário: ${_name}! Código do Erro: ${http.status}`); 
        }
        

    }
}
   
function add(data){
}

function list(){
    let datas;
 
    const http = new XMLHttpRequest();

    http.onreadystatechange = () => {
        if(http.readyState == 4 && http.status == 200) {
            datas = JSON.parse(http.response)
            const tableKeys = Object.keys(datas[0]) 

            for(let j=0; j<datas.length; j++){    
                let tableList = document.getElementById("list");
                let tr = document.createElement("tr"); 
                
                for(let i = 0; i<tableKeys.length; i++){
                    let td = document.createElement("td");
                    let input = document.createElement("input")
                    let span = document.createElement("span");

                    td.setAttribute("data-index-row", j);

                    span.innerHTML =  Object.values(datas[j])[i]
                    span.className="show";

                    input.setAttribute("type", "text");
                    input.setAttribute("name", tableKeys[i])
                    input.setAttribute("value", Object.values(datas[j])[i])
                    input.className="hidden";

                    td.appendChild(span);
                    td.appendChild(input);
                    tr.appendChild(td);  
                }


                let td = document.createElement("td");
                let input = document.createElement("input");

                td.setAttribute("data-index-row", j);
                input.setAttribute("type", "button");
                input.setAttribute('onclick', "window.location.reload()");
                input.setAttribute("value", "atualizar");
                td.className = "hidden"
                input.className = "hidden";

                td.appendChild(input);
                tr.appendChild(td);


                let td1 = document.createElement("td");
                let a1 = document.createElement("a");
                let i1 = document.createElement("i");

                td1.setAttribute("data-index-row", j);
                a1.setAttribute("href", "#");
                a1.setAttribute('onclick', `update(${j}, '/cadastro/update/')`)
                a1.className = "show";
                i1.className = "fas fa-pen";

                a1.appendChild(i1)
                td1.appendChild(a1)
                tr.appendChild(td1);

                
                let td2 = document.createElement("td");
                let a2 = document.createElement("a");
                let i2 = document.createElement("i");
                console.log(`remove(${j}, '${datas[j].name}', '/cadastro/remove/')`)
                td2.setAttribute("data-index-row", j);
                a2.setAttribute("href", "#");
                a2.setAttribute('onclick', `remove(${j}, '${datas[j].name}', '/cadastro/remove/'); window.location.reload()`)
                a2.className = "show";
                i2.className = "fas fa-trash-alt";

                a2.appendChild(i2)
                td2.appendChild(a2)
                tr.appendChild(td2);

                tableList.appendChild(tr);
                
            }
        }
    }

    http.open("GET", "/listagem", true);

    http.send();
    

}
   
list()