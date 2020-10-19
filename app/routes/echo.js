export default async function get(req, res) {
  console.log(req.query)

  //const echo = {
  //  body: 'hello world'
  //};

  res.json(req.query);
}