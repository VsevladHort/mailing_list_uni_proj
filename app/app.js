"use strict";
const defaultLimit = 3;
const dotenv = require('dotenv').config();
const express = require('express');
const emailModel = require('./emails_dao');
const app = express();
const port = process.env.PORT || 3000;
const nodemailer = require('nodemailer');
const path = require("path");
const mongoose = require("mongoose");
app.listen(port, () => console.log(`Server is running on port ${port}`));

app.use(express.static(__dirname));
app.use(express.json());

async function send(toWhom, subj, msg) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    return await transporter.sendMail({
        from: process.env.EMAIL,
        to: toWhom,
        subject: subj,
        text: msg

    });
}

app.get('/emails/:id', async (req, res) => {
    try {
        if (isNotValidId(req)) {
            sendBadIdResponse(res);
            return;
        }
        const check = await isReqIdPresent(req);
        if (!check) {
            sendNotPresentIdResponse(res);
            return;
        }
        const documents = await emailModel.findById(req.params.id);
        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.put('/emails/:id', async (req, res) => {
    try {
        if (isNotValidId(req)) {
            sendBadIdResponse(res);
            return;
        }
        const check = await isReqIdPresent(req);
        if (!check) {
            sendNotPresentIdResponse(res);
            return;
        }
        const uniqueEmail = await isReqEmailUnique(req);
        if (!uniqueEmail) {
            sendNotUniqueEmailResponse(res);
            return;
        }
        const documents = await emailModel.findByIdAndUpdate(req.params.id, req.body);
        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.post('/emails/send', async (req, res) => {
    try {
        const documents = await send(req.body.to, req.body.subject, req.body.text);
        console.log(documents);
        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/emails/send/:email', async (req, res) => {
    res.render("send_email.pug", {email: req.params.email});
});

app.post('/emails/create', async (req, res) => {
    try {
        const uniqueEmail = await isReqEmailUnique(req);
        if (!uniqueEmail) {
            sendNotUniqueEmailResponse(res);
            return;
        }
        const documents = await emailModel.create(req.body);
        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.delete('/emails/:id', async (req, res) => {
    try {
        if (isNotValidId(req)) {
            sendBadIdResponse(res);
            return;
        }
        const check = await isReqIdPresent(req);
        if (!check) {
            sendNotPresentIdResponse(res);
            return;
        }
        await emailModel.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/crud/new', async (req, res) => {
    res.render("email_create.pug");
});

app.get('/crud/:id', async (req, res) => {
    if (isNotValidId(req)) {
        sendBadIdResponse(res);
        return;
    }
    const check = await isReqIdPresent(req);
    if (!check) {
        sendNotPresentIdResponse(res);
        return;
    }
    res.render("email_crud.pug", {doc_id: req.params.id});
});

app.get('/emails.json', async (req, res) => {
    const {page = 1, limit = defaultLimit} = req.query; // default to page 1 and limit 10
    const skip = (page - 1) * limit; // calculate number of documents to skip based on page and limit

    if (page < 1 || limit < 1) {
        res.status(400).send("Bad request parameters!");
        return;
    }

    try {
        const documents = await emailModel.find()
            .sort({email: 1}) // sort documents by email ascending
            .skip(skip) // skip the calculated number of documents
            .limit(limit); // limit the number of documents returned per page

        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

function isNotValidId(req) {
    return !mongoose.Types.ObjectId.isValid(req.params.id);
}

async function isReqIdPresent(req) {
    const check = await emailModel.findById(req.params.id);
    return check != null;
}

async function isReqEmailUnique(req) {
    const check = await emailModel.findOne({email: req.body.email});
    return check == null;
}

function sendNotPresentIdResponse(res) {
    res.status(404).send("Id not found!");
}

function sendNotUniqueEmailResponse(res) {
    res.status(400).send("Email not unique!");
}

function sendBadIdResponse(res) {
    res.status(400).send("Bad id!");
}


emailModel.find().then((res) => console.log(res));


console.log("End of initial sequential script");

