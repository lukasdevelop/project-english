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
  const {name, email, password} = req.body
  const hash = bcrypt.hashSync(password, 10)

  try {
  const verifyEmail = await connection('users')
  .select('email')

  if(verifyEmail.length <= 0){
    return res.status(400).json({error: 'User already exists'})
  }

    const user = await connection('users')
      .insert({
        name,
        email,
        password: hash
      })
      return res.status(200).json({user, token: generateToken({id: user.id})})
  } catch (error) {
      return res.status(500).send({error})
  }
}

const index = async (req, res) => {
  try {
    const users = await connection('users')
      .select('*')
    return res.status(200).json({users})
  } catch (error) {
      return res.status(500).send({error})
  }
}

const authenticate = async (req, res) => {
  const {email, password} = req.body
  const [user] = await connection('users')
  .select('*')
  .where('email','=', email)

  if(!user)
    return res.status(400).send({error: "User not found"})
  if(!await bcrypt.compare(password, user.password))
    return res.status(400).send({error: "Invalid password"})

  user.password = undefined

  return res.status(200).json({user, token: generateToken({id: user.id})})

}

export default {
  create,
  index,
  authenticate
}

