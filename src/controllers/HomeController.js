
const index = (req, res) => {
  let users = ['amaral']
  return res.json({ users, id: req.userId })
}
const dashboard = (req, res) => {

  return res.json({ msg: 'logado'})
}
export default {
  index,
  dashboard
}

