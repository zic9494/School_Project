var Show_Chart = {
  
  type: "pie",
  data:{
    labels: [],
    datasets: {}
  },
  options: {
    plugins: {
      legend: {
        labels: {
          color: "rgb(255, 255, 255)",
        }
      },
    },
    scales: {
      y: {
        ticks: {
          color: "rgb(255, 255, 255)",
        },
        border: {
          color: "rgb(255, 255, 255)",
        },
        display: false,
      },
      x: {
        ticks: {
          color: "rgb(255, 255, 255)",
        },
        border: {
          color: "rgb(255, 255, 255)",
        },
        display: false,
      }
    }
  },

}
var Payment_Lables=["日常開銷", "固定支出", "娛樂開銷", "臨時開銷"]
var ChartObject, ChartObject2
var ctx = document.getElementById("ShowChart").getContext("2d")
var ctx2 = document.getElementById("ShowChart2").getContext("2d")
function Check_Data_Is_Loaded(){
  Assets_Table = document.getElementById("Assets_table").innerHTML
  if (Assets == null || Payment == null){
      setTimeout(()=>Check_Data_Is_Loaded(), 200)
    }else{
      Month_Payment()
    }
}

function NetAsset_Chart(){
  document.getElementById("in_debt").style.display = "block"
  document.getElementById("BarandLine").style.display = "none"
  document.getElementById("Pie").style.display = "none"
  var tmp = [], Dataset = [], labels=[], all_debt = 0, all_net = 0
  var Cookie = Get_Cookie(), Data = NetAssest.Data, Date = NetAssest.Date
  Table_change("bill_table", "assets_table")
  if (ChartObject != undefined){
    ChartObject.destroy()
  }
  if (ChartObject2 != undefined){
    ChartObject2.destroy()
  }
  if (Cookie["in_debt"] == "true"){
    var debts = Debt.Data
    for(var i = 0 ; i < debts.length;i++){
      if (!debts[i]["Settle"]){
        all_debt += debts[i]["Principal"]
      }
    }
  }
  for (var i = 0;i < Data.length ;i++){
    tmp.push(Data[i]-all_debt+all_net)
    labels.push(Date[i])
    all_net += Data[i]
  }
  Dataset.push({
    label : "淨資產累計圖",
    data : tmp,
    backgroundColor: [
      'rgb(255, 255, 255)',
    ],
    borderColor: "rgb(255, 255, 255)"
  })
  Show_Chart["data"]["datasets"] = Dataset
  Show_Chart["data"]["labels"] = labels
  Show_Chart["type"] = "line"
  Show_Chart["options"]["scales"]["y"]["display"] = true
  Show_Chart["options"]["scales"]["x"]["display"] = true
  ChartObject = new Chart(ctx, Show_Chart)
}

function Month_Payment(){
  var tmp =[], Dataset=[]
  Table_change("assets_table", "bill_table")
  document.getElementById("in_debt").style.display = "none"
  document.getElementById("Income_table").style.display = "none"
  document.getElementById("Income_table").style.display = "table"
  document.getElementById("BarandLine").style.display = "block"
  document.getElementById("Pie").style.display = "block"
  for (var i = 0;i < Payment_Lables.length;i++){tmp.push(Payment_Sum(Payment_Lables[i]))}
  Dataset_object={
    label : "本月支出",
    data : tmp,
    backgroundColor: [
      'rgb(153, 0, 255)',
      'rgb(255, 0, 204)',
      'rgb(0, 178, 255)',
      'rgb(0, 136, 255)'
    ],
    borderColor: "rgb(255, 255, 255)"
  }
  Dataset.push(Dataset_object)
  Show_Chart["data"]["datasets"] = Dataset
  Show_Chart["data"]["labels"] = Payment_Lables
  change_Chart_type("bar", "line")
}

function Assets_Analyze(){
  Table_change("bill_table", "assets_table")
  document.getElementById("BarandLine").style.display = "none"
  document.getElementById("Pie").style.display = "none"
  document.getElementById("in_debt").style.display = "none"
  var Data = Assets.Data, tmp=[NetAsses_Sum(), 0, 0, 0, 0, 0], AssetType=["活存", "定存", "債券", "股票", "房地產", "虛擬貨幣"]
  var Dataset = []
  if (ChartObject != undefined){
    ChartObject.destroy()
  }
  if (ChartObject2 != undefined){
    ChartObject2.destroy()
  }
  for (var i=0; i<Data.length; i++){
    var x = 0
    for (;x < 6;x++){
      if (Data[i]["AssetType"]==AssetType[x] ){
        break
      }
    }
    tmp[x] += parseInt(Data[i]["Totalvalue"])
  }
  Dataset.push({
    label : "資產分配圖",
    data : tmp,
    backgroundColor: [
      'rgb(153, 0, 255)',
      'rgb(255, 0, 204)',
      'rgb(0, 178, 255)',
      'rgb(136, 136, 0)',
      'rgb(0, 189, 0)',
      'rgb(0, 255, 255)'

    ],
    borderColor: "rgb(255, 255, 255)"
  })
  Show_Chart["data"]["datasets"] = Dataset
  Show_Chart["data"]["labels"] = AssetType
  Show_Chart["type"] = "pie"
  Show_Chart["options"]["scales"]["y"]["display"] = false
  Show_Chart["options"]["scales"]["x"]["display"] = false
  ChartObject = new Chart(ctx, Show_Chart)
}

function Payment_Sum(kind){
  var Sum = 0
  const Data =Payment.Data
  for (var i = 0;i < Data.length;i++){
    if (Data[i].Price < 0 && Data[i].PayWay == kind){
      Sum -= Data[i].Price
    }
  }
  return Sum
}

function NetAsses_Sum(){
  var NetAssets_Data = NetAssest.Data, Sum = 0
  for (var i = 0;i < NetAssets_Data.length; i++){
    Sum += NetAssets_Data[i].Month_NetAssets
  }
  return Sum
}

function change_Chart_type(ChartType, ChartType2){
  document.getElementById("ShowChart2").style.display="none"
  if (ChartObject != undefined){
    ChartObject.destroy()
  }
  if (ChartObject2 != undefined){
    ChartObject2.destroy()
  }
  
  if (Show_Chart["data"]["datasets"][0]["label"] == "本月支出"){
    Show_Chart.data.labels = Payment_Lables
  }
  
  if (ChartType != "pie"){
    Show_Chart["options"]["scales"]["y"]["display"] = true
    Show_Chart["options"]["scales"]["x"]["display"] = true
  }else{
    Show_Chart["options"]["scales"]["y"]["display"] = false
    Show_Chart["options"]["scales"]["x"]["display"] = false
  }
  Show_Chart.type = ChartType
  ChartObject = new Chart(ctx, Show_Chart)
  if (ChartType2 != undefined){
    if (ChartType2 != "pie"){
      Show_Chart["options"]["scales"]["y"]["display"] = true
      Show_Chart["options"]["scales"]["x"]["display"] = true
    }else{
      Show_Chart["options"]["scales"]["y"]["display"] = false
      Show_Chart["options"]["scales"]["x"]["display"] = false
    }
    document.getElementById("ShowChart2").style.display="block"
    Show_Chart.type = ChartType2
    ChartObject2 = new Chart(ctx2, Show_Chart)
  }
}

function Table_change(none, block){
  var none_table = document.getElementsByClassName(none)
  var block_table =document.getElementsByClassName(block)
  for (var i = 0; i < none_table.length; i++){
    none_table[i].style.display = "none"
  }
  for (var i = 0;i < block_table.length; i++){
    block_table[i].style.display = "table"
  }
}
document.getElementById("in_debt").addEventListener("click", function(e){
  var box = document.getElementById("debt_box")
  Data= "in_debt="+box.checked+";"
  document.cookie = Data
  NetAsset_Chart()
})
