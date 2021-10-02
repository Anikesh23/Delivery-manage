const whitelist = ['http://localhost:8100', 'http://192.168.31.162:8100']
module.exports = {
    origin: (origin: any, callback: any) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error())
        }
    },
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    headers: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}
