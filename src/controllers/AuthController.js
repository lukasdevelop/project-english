import connection from '../database/connection'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.json'

const generateToken = (params = {}) => {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

const create = async (req, res) => {
  const { name, email, password, github, facebook, code } = req.body
  const hash = bcrypt.hashSync(password, 10)

  try {
    const verifyEmail = await connection('users')
      .select('email')
      .where('email', '=', email)

    if (verifyEmail.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await connection('users')
      .insert({
        name,
        email,
        password: hash,
        facebook,
        github,
        code
      })
    return res.status(200).json({ user, token: generateToken({ id: user.id }) })
  } catch (error) {
    return res.status(500).send({ error })
  }
}

const excluir = async (req, res) => {

  const { id } = req.params
  try {
    const user = await connection('users')
      .select('*')
      .where('id', '=', id)
      .del()

    return res.status(200).json({ user })

  } catch (error) {
    return res.status(500).send({ error })
  }
}

const index = async (req, res) => {
  try {
    const users = await connection('users')
      .select('id', 'name', 'email', 'facebook', 'github', 'code', 'status', 'created_at')

    return res.status(200).json({ users })
  } catch (error) {
    return res.status(500).send({ error })
  }
}

const authenticate = async (req, res) => {
  const { email, password } = req.body
  console.log(req.body)
  try {
    const [user] = await connection('users')
      .select('*')
      .where('email', '=', email)

    if (!user)
      return res.status(401).json({ msg: "User not found" })
    if (!await bcrypt.compare(password, user.password))
      return res.status(401).json({ msg: "Invalid password" })

    user.password = undefined

    return res.status(200).json({ user, token: generateToken({ id: user.id }) })
  } catch (error) {
    return res.status(500).send({ error })
  }

}

export default {
  create,
  index,
  excluir,
  authenticate
}

