
const index = (req, res) => {
  let users = ['amaral']
  return res.json({ users, id: req.userId })
}

export default {
  index
}

