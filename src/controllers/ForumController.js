const index = (req, res) => {
  console.log(req.file)
  return res.json({ hello:'teste' })
}

export default {
  index
}

