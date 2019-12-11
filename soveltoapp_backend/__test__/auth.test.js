const request = require("supertest");
const app = require("../app");

describe('Authentication tests', ()=> {
    it('Unauthorized get request returns 403, no permissions', () =>{
        const url = "/api/topics";
        return request(app)
        .get(url)
        .then(response => {
            expect(response.statusCode).toBe(403);
        })
    })
    it('Unauthorized post request returns 403, no permissions', () =>{
        const url = "/api/topics/question";
        return request(app)
        .post(url)
        .send({question: "testing?"})
        .then(response => {
            expect(response.statusCode).toBe(403);
        })})
    it('User is able to register to the service by sending post to address url/register', ()=>{
        const url = "/register";
        return request(app)
        .post(url)
        .send({login: "testing@testing.com",password: "test1234" })
        .then(response => {
            expect(response.statusCode).toBe(200)
            expect(response.body.success).toBe(false);
        })
    })
    it('User is able to login to the serivice by sending post to address url/login with login info', () => {
        const url = "/login";
        return request(app)
        .post(url)
        .send({login: "testing@testing.com",password: "test1234" })
        .then(response => {
            expect(response.statusCode).toBe(200)
            expect(response.body.token).not.toEqual(null);
        })
    })
    it('Returns 404 if sending a get to non existent url', () => {
        const url = "/blaablaa123";
        return request(app)
        .get(url)
        .then(response => {
            expect(response.statusCode).toBe(404);
        })
    })
    it('Returns 404 if sending a post to non existent url', () => {
        const url = "/blaablaa123";
        return request(app)
        .post(url)
        .send({blaa: "blaablaa"})
        .then(response => {
            expect(response.statusCode).toBe(404);
        })
    })
})
describe('Validation tests', () => {
    it('register login has to have a "@"-character', () => {
        const url = "/register";
        return request(app)
        .post(url)
        .send({login: "ilman 234miumau", password: "testi123"})
        .then(response => {
            expect(response.body.message).toMatch("Registration failed. Use your email for registeration.")
            
        })
    })
    /* it('password is not null', () => {
        const url = "/register";
        return request(app)
        .post(url)
        .send({login: "valid@loginname.com", password: "badword"})
        .then(response => {
            expect(response.statusCode).not.toBe(200);
        })
    }) */
})