import bcryptjs from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@electro.com',
        password: bcryptjs.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: ' John',
        email: 'john@electro.com',
        password: bcryptjs.hashSync('123456', 10),
        isAdmin: false
    },
    {
        name: 'Jain',
        email: 'jain@electro.com',
        password: bcryptjs.hashSync('123456', 10),
        isAdmin: false
    },
]

export default users