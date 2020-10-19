export async function get(req, res) {
    const hello = {
      body: 'hello world'
    };
    res.json(hello);
  }