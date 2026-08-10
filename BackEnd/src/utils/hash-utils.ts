import bcrypt from 'bcryptjs'

const saltRounds = Number(process.env.SALT_ROUNDS)

export const hashValues = async (value: string) => {
    return await bcrypt.hash(value, saltRounds);
}

export const verifyHash = async (value: string, hashedValue: string) => {
    return await bcrypt.compare(value, hashedValue)
}