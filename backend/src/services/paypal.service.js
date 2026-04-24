import fetch from 'node-fetch';

const paypalConfig = {
  clientId: "ASq6PpMotnb7qi_s9c1NZQkzci97ajECBrnPVziSpSi0uidYzNvfB8doIk3mph8ALNqvjglWDKLBzh0k",
  clientSecret: 'EIRwUYX8DdCVnui_419UEB3wIC2XyFFdrOBn8hGOr4Xs_LKjwckUBs91SNz0o4cvWg2Ib3gdkkeMGXcb',
  baseUrl: 'https://api-m.sandbox.paypal.com'
};

function getBasicAuth() {
  return Buffer
    .from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`)
    .toString('base64');
}

export async function getAccessToken() {
  const response = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${getBasicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Error obteniendo token');
  }

  return data.access_token;
}

export async function createPaypalOrder(orderData) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
  intent: 'CAPTURE',

  purchase_units: [{
    amount: {
      currency_code: 'MXN',
      value: Number(orderData.total).toFixed(2)
    }
  }],

  application_context: {
    brand_name: "Papelería",
    landing_page: "LOGIN",
    user_action: "PAY_NOW",
    return_url: "http://localhost:4200/paypal",
    cancel_url: "http://localhost:4200/paypal"
  }

})
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Error creando orden');
  }

  return data;
}

export async function capturePaypalOrder(orderId) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${paypalConfig.baseUrl}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Error capturando orden');
  }

  return data;
}