// Token-asetukset
module.exports = {
    port: 5432,
    saltRounds: 3,
    jwtSecret: 'yo-its-a-secret',
    tokenExpireTime: '6h',
    sequelizeConfig: {
        host: 'localhost',
        dialect: 'postgres',
        port: 5432,
    
        pool: {
            max: 9,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}

