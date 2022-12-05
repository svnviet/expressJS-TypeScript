import { Request, RequestHandler, Response } from 'express';
import * as UserService from './users.service';
import * as CompanyService from '../companies/companies.service';
import firebaseAdmin from '../config/firebaseAdmin'

var bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const saltRounds = 10;

export const getAllUsers: RequestHandler = async (req: Request, res: Response) => {
    try {
        const users = await UserService.getUsers();

        res.status(200).json({
            users
        });
    } catch (error) {
        console.error('[users.controller][getAllUsers][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching users'
        });
    }
};

export const getUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserById(parseInt(req.params.id));

        res.status(200).json({
            "user": user,
            "firebase": (await firebaseAdmin.auth().getUser(user.uid))
        });
    } catch (error) {
        console.error('[users.controller][getUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching user'
        });
    }
};

export const createUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const company = await CompanyService.getCompanyByCompanyCode(req.body.company_code);
        // console.log("[users.controller][createUser][getCompanyByCompanyCode] :", company);

        if (company == null) {
            res.status(400).send({ error: true, message: 'Invalid Company Code' });
        } else {
            if (company.status != 1) {
                res.status(400).send({ error: true, message: 'Invalid Company Status' });
            } else {
                if (!emailRegexp.test(req.body.email)) {
                    res.status(400).send({ error: true, message: 'Invalid Email Format' });
                } else {
                    const user = await UserService.getUserByEmail(req.body.email);
                    // console.log("[users.controller][createUser][getUserByEmail] :", user);

                    if (user != null) {
                        res.status(400).send({ error: true, message: 'Email already exists' });
                    } else {
                        req.body.company_id = company.id;
                        req.body.code = Math.floor(Math.random() * 90000) + 10000;

                        bcrypt.genSalt(saltRounds, function (err: any, salt: any) {
                            bcrypt.hash(req.body.password, salt, async function (err: any, hash: any) {
                                // firebase
                                await firebaseAdmin.auth().createUser({
                                    password: req.body.password,
                                    email: req.body.email
                                })
                                    .then(async (userCredential) => {
                                        // console.error('[users.controller][createUser][firebase][createUserWithEmailAndPassword][Success] ', typeof userCredential === 'object' ? JSON.stringify(userCredential) : userCredential);
                                        req.body.uid = userCredential.uid
                                        req.body.password = hash;
                                        const result = await UserService.createUser(req.body);

                                        res.status(200).json({
                                            result
                                        });
                                    })
                                    .catch((error) => {
                                        console.error('[users.controller][createUser][firebase][createUserWithEmailAndPassword][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
                                        res.status(500).json({
                                            message: 'There was an error when firebase-createUserWithEmailAndPassword'
                                        });
                                    });
                            });
                        });

                        sendMail(req.body.email, req.body.code);
                    }
                }
            }
        }
    } catch (error) {
        console.error('[users.controller][createUser][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when adding new user'
        });
    }
};

export const updateUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await UserService.updateUserById(parseInt(req.params.id), req.body);

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[users.controller][updateUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when updating user'
        });
    }
};

export const deleteUserById: RequestHandler = async (req: Request, res: Response) => {
    try {
        const result = await UserService.deleteUserById(parseInt(req.params.id));

        res.status(200).json({
            result
        });
    } catch (error) {
        console.error('[users.controller][deleteUserById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when deleting user'
        });
    }
};

export const verifyRegisterCode: RequestHandler = async (req: Request, res: Response) => {
    try {
        const user = await UserService.getUserById(req.body.user_id);
        if (user == null) {
            res.status(400).send({ message: 'Invalid User Id' });
        } else {
            if (user.code == req.body.code) {
                try {
                    await UserService.updateUserStatusById(req.body.user_id, 1);

                    // firebase
                    firebaseAdmin.auth()
                        .updateUser(user.uid, {
                            emailVerified: true
                        })
                        .then((userRecord) => {
                            console.log('[users.controller][verifyRegisterCode][firebase] Successfully updated emailVerified status', userRecord.toJSON());
                        })
                        .catch((error) => {
                            console.log('Error updating user:', error);
                        });
                } catch (error) {
                    console.error('[users.controller][verifyRegisterCode][updateUserStatusById][Error] ', typeof error === 'object' ? JSON.stringify(error) : error);
                    res.status(500).json({
                        message: 'There was an error when updating user status'
                    });
                }
                res.status(200).send({ message: 'Authentication successful' });
            }
            else {
                res.status(400).send({ message: 'Invalid Code' });
            }
        }
    } catch (error) {
        console.error('[users.controller][verifyRegisterCode][getUserById][Error]', typeof error === 'object' ? JSON.stringify(error) : error);
        res.status(500).json({
            message: 'There was an error when fetching user'
        });
    }
};

function sendMail(email: string, code: string) {
    const smtpEndpoint = process.env.SES_AWS_SMTP_ENDPOINT;
    const port = process.env.SES_AWS_SMTP_PORT;
    const senderAddress = process.env.SES_AWS_SMTP_SENDER;
    const toAddresses = email;
    const smtpUsername = process.env.SES_AWS_SMTP_USERNAME;
    const smtpPassword = process.env.SES_AWS_SMTP_PASSWORD;

    async function main() {
        const transporter = nodemailer.createTransport({
            host: smtpEndpoint,
            port: port,
            auth: {
                user: smtpUsername,
                pass: smtpPassword
            }
        });

        let mailOptions = {
            from: senderAddress,
            to: toAddresses,
            subject: '認証コード',
            text: ``,
            html: `アプリに認証コードを登録して下さい。</br>認証コードは、</br>${code}</br>です。`,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Message sent! Message ID: ", info);
    }

    main().catch(console.error);
}