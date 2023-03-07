import db from '../models';

export const getOne = (userID) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { id: userID },
            attributes: {
                exclude: ['password', 'role_code']
            },
            include: [
                {model: db.Role, as: 'roleData', attributes: ['id', 'code', 'value']}
            ]
        })
        resolve({
            error: response ? 0 : 1,
            message: response ? 'Got' : 'User not found',
            userData: response 
        })
    } catch (error) {
        reject(error)
    }
})
