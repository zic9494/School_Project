var Payment, Debt, Assets, NetAssest, SumNetAssest = 0
var Search_Year, Search_Month

window.onload=function(){
    var time = new Date(Date.now())
    Search_Year = time.getFullYear()
    Search_Month = time.getMonth()+1
    Date_Deal()
    Get_Payment_data(Search_Year, Search_Month)
    Get_Debt_Data()
    Get_Netassets_Data()
    Get_Assets_Data()
    Check_Data_Is_Loaded()
}
function Date_Deal(){
    document.getElementsByName("target_month")[0].value = Search_Month
    var TimeTag = document.getElementById("Search")
    TimeTag.innerHTML = Search_Year+" / "+Search_Month+TimeTag.innerHTML
}
function loadScript(url){    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}
function Get_Cookie(){
    var data={}
    var Str = document.cookie
    Str = Str.split("; ")
    for (var i = 0;i < Str.length; i++){
        tmp = Str[i].split("=")
        data[tmp[0]]=tmp[1]
    }
    return data
}
var drawer = document.getElementById("drawer")
drawer.addEventListener("click",function(){
    var user_info = document.getElementById("user_info")
    var user_info_display = window.getComputedStyle(user_info,"dispaly").getPropertyValue("display")
    if (user_info_display=="none"){
        user_info.style.opacity = 1
        document.body.style.opacity = 0.5
        user_info.style.display = "block"
    }else{
        document.body.style.opacity = 1
        user_info.style.display = "none"
    }
})

var Delete_Check= document.getElementsByName("delete")[0]
Delete_Check.addEventListener("click",event=>{
    if(event.target.checked){
        alert("You are deleting data, please make sure your action is true")
        document.getElementsByName("delete")[0].value = "true"
    }else{
        document.getElementsByName("delete")[0].value = "false"
    }
})

var Settle_Check= document.getElementsByName("settle")[0]
Settle_Check.addEventListener("click",event=>{
    if(event.target.checked){
        Settle_Check.value="true"
    }else{
        Settle_Check.value = "false"
    }
})

function month_move(move){
    console.log("Peko");
    Search_Month += move 
    switch(Search_Month){
        case 0:
            Search_Year--
            Search_Month = 12
            break
        case 13:
            Search_Year++
            Search_Month = 1 
            break
    }
    Get_Payment_data(Search_Year, Search_Month)
    document.getElementById("Search").innerText = Search_Year+" / "+Search_Month
    Payment = null
    Check_Data_Is_Loaded()
}

function LogOut(){
    document.cookie = "mysession = ''"
    window.location.replace("/")
}

function FormChage(what, values, Index, ServerID){
    tmp = document.getElementsByClassName("debt")
    DispalyChange(tmp,"none")
    tmp = document.getElementsByClassName("payment")
    DispalyChange(tmp,"none")
    tmp = document.getElementsByClassName("assets")
    DispalyChange(tmp,"none")
    tmp = document.getElementsByClassName("income")
    DispalyChange(tmp,"none")
    document.getElementById("delete_checkbox").style.display = "none"
    if (what != undefined){
        document.getElementById("close_form").style.display = "block"
        document.getElementById("submit").style.display="block"
        document.getElementById("content").style.display="block"
    }else{
        document.getElementById("close_form").style.display = "none"
        document.getElementById("submit").style.display="none"
        document.getElementById("content").style.display="none"
    }
    tmp = document.getElementsByClassName(what)
    DispalyChange(tmp,"block")
    document.getElementById("ReturnType").value = what
    if (values != undefined && ServerID != undefined && Index!=undefined ){
        for (var i=0;i<Index.length;i++){
            document.getElementsByName(Index[i])[0].value=values[i]
        }
        document.getElementById("Form").action = "/bill/update"
        document.getElementsByName("TargetId")[0].value = ServerID
        document.getElementById("delete_checkbox").style.display = "block"
    }
}

function DispalyChange(elem, Into){
    for (i = 0;i<elem.length;i++){
        elem[i].style.display = Into
    }
}


function Get_Payment_data(year, month){
    var url = "/data/payment?year="+year+"&month="+month
    var link_payment = new XMLHttpRequest
    link_payment.open("GET",url)
    link_payment.send()
    link_payment.onload = function(){
        Payment = JSON.parse(link_payment.responseText)
    }
    document.getElementById("Payment_table").innerHTML = "Loading"
    setTimeout(()=>Stop_Loading(Payment,  "Payment"),500)
    document.getElementById("Income_table").innerHTML = ""
    setTimeout(()=>Stop_Loading(Payment, "Payment"),500)
}

function Get_Debt_Data(){
    var link_debt = new XMLHttpRequest
    link_debt.open("GET", "/data/debt")
    link_debt.send()
    link_debt.onload =function(){
        Debt = JSON.parse(link_debt.responseText) 
    }
    document.getElementById("Debt_table").innerHTML = ""
    setTimeout(()=>Stop_Loading(Debt, "Debt"),500)
}

function Get_Assets_Data(){
    var link_assets=new XMLHttpRequest
    link_assets.open("GET","/data/assets")
    link_assets.send()
    link_assets.onload = function (){
        Assets = JSON.parse(link_assets.responseText)
    }
    document.getElementById("Assets_table").innerHTML=""
    setTimeout(()=>{Stop_Loading(Assets, "Assets")}, 500)
}

function Get_Netassets_Data(){
    var link_netassets=new XMLHttpRequest
    link_netassets.open("GET","/data/netassets")
    link_netassets.send()
    link_netassets.onload = function (){
        NetAssest = JSON.parse(link_netassets.responseText)
    }
    document.getElementById("Netassets_table").innerHTML="Loading"
    setTimeout(()=>{Stop_Loading(NetAssest, "Netassets")}, 500)
}


function Stop_Loading(Item, who){
    if (Item == null ){
        switch(who){
            case "Payment":{setTimeout(()=>Stop_Loading(Payment,"Payment"),500); break}
            case "Debt":{setTimeout(()=>Stop_Loading(Debt, "Debt"),500); break}
            case "Assets":{setTimeout(()=>Stop_Loading(Assets, "Assets"),500); break}
            case "Netassets":{setTimeout(()=>Stop_Loading(Assets, "Assets"),500); break}
        }
    }else{
        switch(who){
            case "Payment":{setTimeout(Show_Payment_Data(), 500);break}
            case "Debt":{setTimeout(()=>Show_Debt_Data(), 500);break}
            case "Assets":{setTimeout(()=>Show_Assests_Data(), 500);break}
            case "Netassets":{setTimeout(()=>Show_Netassets_Data(), 500);break}
        }
    }
}

function Show_Payment_Data(){
    if (Payment== null){
        setTimeout(()=>Show_Payment_Data(), 600)
    }else{
        var Payment_Table = document.getElementById("Payment_table")
        var Income_Table = document.getElementById("Income_table")
        var Payment_Data = Payment.Data
        var Tmp_Str = ""
        var Payment_Str="<h2>Payment</h2><tr><th>Price</th><th>Date</th><th>pay on</th><th>Content</th><th>edit</th>"
        var Income_Str="<h2>Income</h2><tr><th>Price</th><th>Date</th><th>Content</th><th>edit</th>"
        for (var i=0; i<Payment_Data.length;i++){
            if (Payment_Data[i].Price<0){
                Tmp_Str += "<tr><th>"
                Tmp_Str += Payment_Data[i].Price*-1+"</th><th>"
                Tmp_Str += Payment_Data[i].Date+"</th><th>"
                Tmp_Str += Payment_Data[i].PayWay+"</th><th>"
                Tmp_Str += Payment_Data[i].Content+"</th>"
                Tmp_Str += "<th onclick='Edit_Btn(\"payment\","+i+")'>:</th></tr>"
                Payment_Str += Tmp_Str
                Tmp_Str = ""
            }else{
                continue
            }
        }
        for (var i=0; i<Payment_Data.length;i++){
            if (Payment_Data[i].Price>0){
                Tmp_Str += "<tr><th>"
                Tmp_Str += Payment_Data[i].Price+"</th><th>"
                Tmp_Str += Payment_Data[i].Date+"</th><th>"
                Tmp_Str += Payment_Data[i].Content+"</th>"
                Tmp_Str += "<th onclick='Edit_Btn(\"income\","+i+")'>:</th></tr>"
                Income_Str += Tmp_Str
                Tmp_Str = ""
            }else{
                continue
            }
        }
        Payment_Table.innerHTML = Payment_Str
        Income_Table.innerHTML = Income_Str
    }
}

function Show_Debt_Data(){
    if(Debt==null){
        setTimeout(()=>Show_Debt_Data(), 600)
    }else{
        var Debt_Table = document.getElementById("Debt_table")
        var Debt_Data = Debt.Data
        var Tmp_Str = ""
        var Debt_Str = "<h2>Debt</h2><tr><th>Principal</th><th>Interest</th><th>Attribute</th><th>Settle</th><th>Content</th><th>edit</th></tr>"
        for(var i=0;i<Debt_Data.length;i++){
            Tmp_Str += "<tr><th>"
            Tmp_Str += Debt_Data[i].Principal+"</th><th>"
            Tmp_Str += Debt_Data[i].Interest+"</th><th>"
            Tmp_Str += Debt_Data[i].Attribute+"</th><th>"
            if (Debt_Data[i].Settle){
                Tmp_Str += "已清償</th><th>"
            }else{
                Tmp_Str += "償還中</th><th>"
            }
            Tmp_Str += Debt_Data[i].Content+"</th>"
            Tmp_Str += "<th onclick='Edit_Btn(\"debt\","+i+")'>:</th>"
            Debt_Str+=Tmp_Str
            Tmp_Str=""
        }
        Debt_Table.innerHTML=Debt_Str
    }
}

function Show_Assests_Data(){
    if (Assets== null){
        setTimeout(()=>Show_Assests_Data(), 600)
    }else{
        var Assets_Table = document.getElementById("Assets_table")
        var Assets_Data = Assets.Data
        var Assets_Str = "<h2>Assets</h2><tr><th>Total Volue</th><th>Asset Type</th><th>Currency Type</th><th>Content</th><th>edit</th></tr>"
        var Tmp_Str = "<tr><th>"+SumNetAssest+"</th><th>活存</th><th>TWD</th><th>每月結餘</th><th>系統自動生成</th>"
        for (var i=0;i<Assets_Data.length;i++){
            Tmp_Str += "<tr><th>"
            Tmp_Str += Assets_Data[i].Totalvalue+"</th><th>"
            Tmp_Str += Assets_Data[i].AssetType+"</th><th>"
            Tmp_Str += Assets_Data[i].CurrencyType+"</th>"
            Tmp_Str += "<th>"+Assets_Data[i].Content+"</th>"
            Tmp_Str += "<th onclick='Edit_Btn(\"assets\","+i+")'>:</th>"
            Assets_Str += Tmp_Str
            Tmp_Str = ""
        }
        Assets_Table.innerHTML = Assets_Str;
    }
}

function Show_Netassets_Data(){
    if (NetAssest == null){
        setTimeout(()=>Show_Netassets_Data(), 500)
    }else{
        var NetAssets_Table = document.getElementById("Netassets_table")
        var NetAssets_Data = NetAssest.Data
        var NetAssets_Date = NetAssest.Date
        var NetAssets_Str = "<h2>Net Assets</h2><th>Balance</th><th>Month</th></tr>"
        var Tmp_Str = ""
        for (var i = 0;i < NetAssets_Date.length; i++){
            Tmp_Str += "<tr><th>"
            Tmp_Str += NetAssets_Data[i]+"</th><th>"
            Tmp_Str += NetAssets_Date[i]+"</th>"
            NetAssets_Str += Tmp_Str
            Tmp_Str = ""
            SumNetAssest += NetAssets_Data[i]
        }
        NetAssets_Table.innerHTML = NetAssets_Str
    }
}

function Edit_Btn(what, Table_Id){
    var value_array, Data, Index_array
    switch(what){
        case "payment": {
            Data = Payment.Data[Table_Id]
            value_array = [Data.Price*-1, Data.Date, Data.PayWay, Data.Content]
            Index_array = ["price", "date", "payway", "content"]
            break;
        }
        case "income":{
            Data = Payment.Data[Table_Id]
            value_array = [Data.Price, Data.Date, Data.Content]
            Index_array = ["price", "date", "content"]
            break;
        }
        case "debt":{
            Data = Debt.Data[Table_Id]
            value_array = [Data.Principal, Data.Interest, Data.Attribute, Data.Settle, Data.Content]
            Index_array = ["principal", "interest", "attribute", "settle", "content"]
            document.getElementsByName("settle")[0].checked = Data.Settle
            break;
        }
        case "assets":{
            Data = Assets.Data[Table_Id]
            value_array = [Data.Totalvalue, Data.Content, Data.CurrencyType, Data.AssetType]
            Index_array = ["total_volue", "content", "currencytype", "assetstype"]
            break;
        }
        default:{
            console.log("Nothing happend");
            return
        }
    }
    FormChage(what, value_array, Index_array, Data.Id)
}