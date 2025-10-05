let search = document.getElementById("search");
let list = document.getElementById("list");
let sortMarketCapByOrder=document.getElementById("sort-marketCap-by-order");
let sortPercentageByOrder=document.getElementById("sort-percentage-by-order");



let globalData = []
async function fetchData() {
    await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false")
        .then(res => res.json())
        .then(data => {
            globalData = data
            renderData(data)
        })
        .catch(error => console.log(error))

}

function renderData(data) {
    list.innerHTML = ""
    data.forEach(item => {
        const row = `
      <tr>
        <td><img class="logo" src="${item.image}" alt="${item.name}" width="25"></td>
        <td>${item.name}</td>
        <td>${item.symbol.toUpperCase()}</td>
        <td>$${item.current_price.toLocaleString()}</td>
        <td>${item.total_volume.toLocaleString()}</td>
        <td style="color:${item.price_change_percentage_24h >= 0 ? 'green' : 'red'};">
          ${item.price_change_percentage_24h.toFixed(2)}%
        </td>
        <td>$${item.market_cap.toLocaleString()}</td>
      </tr>
    `;
        list.innerHTML += row;
    });
}

function handleSearch() {

    let userInputValue = search.value.toLowerCase();
    if (userInputValue === "") {
        renderData(globalData)
        return;
    }
    let filteredData = globalData.filter((item) => item.name.toLowerCase().includes(userInputValue)||item.symbol.toLowerCase().includes(userInputValue))
    if (filteredData.length > 0) {
        renderData(filteredData)
    }
    else {
        list.innerHTML = `<tr><td colspan="7" class="no-result">No Results found</td></tr>`
    }


}

function handleMarketCapSort(){
    let value=sortMarketCapByOrder.value
    if(value==="asc"){
    let sortedData=[...globalData].sort((a,b)=>a.market_cap-b.market_cap);
    renderData(sortedData)
    }
    if(value=="dsc"){
        let sortedData=[...globalData].sort((a,b)=>b.market_cap-a.market_cap);
        renderData(sortedData)
    }

}
function handlePercentageSort(){
    let value=sortPercentageByOrder.value;
    if(value==="asc"){
    let sortedData=[...globalData].sort((a,b)=>a.price_change_percentage_24h-b.price_change_percentage_24h)
    renderData(sortedData)
    }
    if(value==="dsc"){
        let sortedData=[...globalData].sort((a,b)=>b.price_change_percentage_24h-a.price_change_percentage_24h)
        renderData(sortedData)
    }
}

search.addEventListener("input", handleSearch);
sortMarketCapByOrder.addEventListener("change",handleMarketCapSort);
sortPercentageByOrder.addEventListener("change",handlePercentageSort)

fetchData()