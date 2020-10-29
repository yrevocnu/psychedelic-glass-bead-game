export default async function get(req, res) {
  res.json(req.query);
}