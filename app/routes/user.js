import crypto from 'crypto';
import querystring from 'querystring';
import User from '../models/User.js';

const nonces = {};

export async function login(req, res) {
  const nonce = crypto.randomBytes(16).toString('base64');
  const payload = `nonce=${nonce}&return_sso_url=${process.env.HOST}/login/redirect`;
  const base64Payload = Buffer.from(payload).toString('base64');
  const encodedPayload = encodeURIComponent(base64Payload);
  const hexSignature = crypto.createHmac('sha256', process.env.DISCOURSE_SSO_SECRET).update(base64Payload).digest('hex');
  
  nonces[nonce] = true;
  
  return res.redirect(`https://discourse.ecult.org/session/sso_provider?sso=${encodedPayload}&sig=${hexSignature}`);
}

export async function redirect(req, res) {
  const { sig, sso } = req.query;
  const decodedSso = decodeURIComponent(sso);
  const hash = crypto.createHmac('sha256', process.env.DISCOURSE_SSO_SECRET).update(decodedSso).digest('hex');
  
  if (sig !== hash) {
    return res.sendStatus(401);
  }

  const queryString = new Buffer(sso,'base64').toString();
  const params = querystring.parse(queryString);

  if (!nonces[params.nonce]) {
    return res.sendStatus(401);
  }

  delete nonces[params.nonce];

  await User.upsert({
    'auth.discourse.id': params.external_id
  }, {
    'auth.discourse.username': params.username
  });

  res.sendStatus(200);
}