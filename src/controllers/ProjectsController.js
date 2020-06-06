import connection from '../database/connection'

const index = async (req, res) => {
  const projects = await connection('projects')
    .select('*')
    .limit(3)

  return res.status(200).json(projects)
}

const create = async (req, res) => {
  const {title, description, author} = req.body
  try {
    await connection('projects')
    .insert({
      title,
      description,
      author
    })

    return res.status(200).json({message: 'Project create with success.'})

  } catch (error) {
    res.status(500).send({error})
  }

}

export default {
  index,
  create
}

