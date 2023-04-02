// This is your test secret API key.
const stripe = require('stripe')('sk_test_51MquIOLw5aoBfGhESpaorr0Ytj0xfSOMe9J3uymQmGgHGdIfGbDvEgh03nLMl8qEBvIkKREmIaoayLxGqloBO8ba00C3cDpky6');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';


// here they are handling the route they are saying here whenever the receive a request to the route /create-checkout-session they are going to create a new checkout session and they are going to redirect the user to that checkout session
// in our case we are recieving the request on "/orders" so we should write this controller in the ordersController.js file
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    // line_items this is the item you want to display to the user for example if the user selected i-phone and samsung galaxy you will want to display those items to the user  and the quantity of each item and the price of each item
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 4,
      },
    ],
    // here they what type of payment the user is going to use
    mode: 'payment',
    // here they are saying if the user is successful in paying for the items they are going to redirect the user to the success page for example we can redirect the user to the home page after their payment is successful
    success_url: `${YOUR_DOMAIN}?success=true`, // redirect to success page
    // here they are saying if the user is not successful in paying for the items they are going to redirect the user to the cancel page for example we can redirect the user back to cart after their payment is canceled
    cancel_url: `${YOUR_DOMAIN}?canceled=true`, // redirect to cancel page
  });
  // here session.url is the url of the checkout session page that we are going to redirect the user to
  // when the user will send a request we will the request to frontend and on the frontend we will display the session.url page to the user
  
  res.json({url:session.url});
});

app.listen(4242, () => console.log('Running on port 4242'));