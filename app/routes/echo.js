export default async function get(req, res) {
  console.log(req.query)

  res.json(req.query);
}