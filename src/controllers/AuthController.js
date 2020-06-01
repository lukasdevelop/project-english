import connection from '../database/connection'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import authConfig from '../config/auth.json'
import crypto from 'crypto'
import mailer from '../modules/mailer'


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
      return res.status(400).json({ message: 'User already exists' })
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
      .select('*')

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
      return res.status(401).json({ message: "User not found" })
    if (!await bcrypt.compare(password, user.password))
      return res.status(401).json({ message: "Invalid password" })


    return res.status(200).json({ user, token: generateToken({ id: user.id }) })
  } catch (error) {
    return res.status(500).send({ error })
  }
}

 const forgotpassword = async(req, res) => {
  const { email } = req.body

  try {
    const [user] = await connection('users')
      .select('id', 'email')
      .where('email', '=', email)

      if(!user)
        return res.status(401).json({ message: "User not found" })

      const token = crypto.randomBytes(20).toString('hex')
      const url = process.env.FRONT_URL

      const now = new Date()
      now.setHours(now.getHours() + 1)


      await connection('users')
       .select('*')
       .where('id', '=', user.id)
       .update({
         passwordResetToken: token,
         passwordResetExpires: now
       })

    let context = {
        token,
        url
    };

      mailer.sendMail({
        to: email,
        from: 'lkg.master@gmail.com',
        template: 'auth/forgot_password',
        context,
      }, (err) => {
        if(err)
          return res.status(400).send({ message: "Cannot send forgot password"})

        return res.status(200).send({message: "Email send with success."})
      })

  } catch (error) {
    res.status(500).send({error})
  }
 }

 const resetpassword = async(req, res) => {
   const {email, password} = req.body
   const {token} = req.query

   try {

    const [user] = await connection('users')
      .select('id', 'email', 'passwordResetExpires', 'passwordResetToken', 'password')
      .where('email', '=', email)

    if(!user)
      return res.status(401).json({ message: "User not found" })


    if(token != user.passwordResetToken)
      return res.status(400).send({ message: 'Token invalid'})

    const now = new Date()

    const hash = bcrypt.hashSync(password, 10)


    if( now > user.passwordResetExpires)
      return res.status(400).send({ message: 'Token expired, generated a new one'})

    await connection('users')
    .select('id', 'email', 'passwordResetExpires', 'passwordResetToken', 'password')
    .where('email', '=', email)
    .update({
      password: hash
    })

    return res.status(200).send({message: "Password changed with success"})

   } catch (error) {
    res.status(500).send({error})
   }


 }

export default {
  create,
  index,
  excluir,
  authenticate,
  forgotpassword,
  resetpassword
}

