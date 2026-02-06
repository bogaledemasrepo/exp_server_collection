export const paymentService=async (amount:number,currency:string)=>{
   const response = await fetch('https://api.chapa.co/v1/transaction/initialize',{
                method: 'POST',
                headers: {
                'Authorization': 'Bearer CHASECK-xxxxxxxxxxxxxxxx',
                'Content-Type': 'application/json'
                },
            body:`{
                "amount": ${amount},
                "currency": ${currency},
                "email": "abebech_bekele@gmail.com",
                "first_name": "Bilen",
                "last_name": "Gizachew",
                "phone_number": "0912345678",
                "tx_ref": "chewatatest-6669",
                "callback_url": "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
                "return_url": "https://www.google.com/",
                "customization[title]": "Payment for my favourite merchant",
                "customization[description]": "I love online payments",
                "meta[hide_receipt]": "true"
            }`
        })
  
const data= await response.json()
console.log(data)
}

paymentService(1000,"ETB")