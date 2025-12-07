fetch("https://api.chapa.co/v1/transaction/initialize",{
    method:"POST",
    headers:{
        'Authorization': 'Bearer CHASECK_TEST-iSzhVQV9YPK5YR1XVFVKcB3TT1b11NDe',
        'Content-Type': 'application/json'
     },
      body: JSON.stringify({
        "amount": "10000",
        "currency": "USD"
        })

}).then(res=>res.json()).then(resp=>console.log(resp)).catch(err=>console.log(err))