import type { Request, Response } from "express";
import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET!);
interface CheckoutRequest extends Request {
    user?:  {email: string,id:string,name:string,avatar:string}
}

export const getCheckoutSession=async (req:CheckoutRequest,res:Response)=>{
  console.log("Create checkout session req user ",req.user);
    if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const {amount}=req.body;
    const response = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    client_reference_id: req.user.id,
      customer_email: req.user.email,
      line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: 'Shoe Shop Payment',
            images:[""]
          },
          unit_amount: amount*100,
        
        },
        quantity: 1,
               
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get("host")}/shoshop`,
    cancel_url: `${req.protocol}://${req.get("host")}/shoshop`, 
  });

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ error: "Internal Server Error" });
    
  }
  
}