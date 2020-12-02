import jwt from 'jsonwebtoken'

const createToken = (userId)=> {
   return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

export {createToken}