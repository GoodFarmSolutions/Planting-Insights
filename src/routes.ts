import express from 'express';
import {CustomSession} from "./customSession";
import axios, { AxiosResponse } from 'axios';

const router = express.Router();

let session: CustomSession = {
    clientId: "",
    authServer: "https://cognito-idp.us-east-2.amazonaws.com",
    dataServer: "https://api.partner.bananorama.com/",
    email: '',
    password: '',
    flow: 'USER_PASSWORD_AUTH'
}

router.get('/', async (req, res) => {
    res.render('login', { title: 'Login' });
});

router.get('/login', async (req, res) => {
    if (!session.clientId) {
        res.redirect('/settings');
        return;
    }

    try {
        const { clientId, authServer, email, password, flow } = session;

        console.log(session)
        console.log(authServer)

        const headers = {
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
            'Content-Type': 'application/x-amz-json-1.1'
        };

        const data = {
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            },
            AuthFlow: flow,
            ClientId: clientId
        };

        const response = await axios.post(<string>authServer, data, {headers});
        const accessToken = response.data.AuthenticationResult.AccessToken;
        session.accessToken = accessToken;

        res.redirect('/organizations');
    } catch (error) {
        res.status(500).send('Error retrieving access token from cognito');
    }
});

router.get('/settings', (req, res) => {
    res.render('settings', {
        title: 'Settings',
        session
    });
});

router.post('/settings', (req, res) => {
    session.clientId = req.body.clientId;
    session.authServer = req.body.authServer;
    session.email = req.body.email;
    session.password = req.body.password;
    session.flow = req.body.flow;

    res.redirect('/settings');
});

router.get('/organizations', async (req, res) => {
    const accessToken = session.accessToken;

    try {
        const response = await axios.get(`${session.dataServer}sharing`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        console.log(response.data);

        const organizations = response.data.items;
        res.render('organizations', { title: 'Organizations', organizations });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Error fetching organizations');
    }
});

router.get('/fields/:orgCode', async (req, res) => {
    const accessToken = session.accessToken;
    const orgCode = req.params.orgCode;

    try {
        const response = await axios.get(`${session.dataServer}sharing/${orgCode}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const fields = response.data;
        fields.orgCode = orgCode;
        res.render('fields', { title: 'Fields', fields });
    } catch (error) {
        console.error('Error fetching fields:', error);
        res.status(500).send('Error fetching fields');
    }
});

router.get('/organization/:orgCode/download2020/:streamId', async (req, res) => {
    const accessToken = session.accessToken;
    const streamId = req.params.streamId;
    const orgCode = req.params.orgCode;

    try{
        const response = await axios.get(`${session.dataServer}sharing/${orgCode}/${streamId}/download`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const files = response.data.files;
        console.log(files)
        res.send(files);
    }
    catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).send('Error downloading file');
    }
});


router.get('/organization/:orgCode/fieldDetails/:uuid', async (req, res) => {
    const accessToken = session.accessToken;
    const uuid = req.params.uuid;
    const orgCode = req.params.orgCode;

    try {
        const response = await axios.get(`${session.dataServer}sharing/${orgCode}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        let field = getField(response);
        field.orgCode = orgCode;
        res.render('fieldDetails', { title: 'Field Details', field });
    } catch (error) {
        console.error('Error fetching field details:', error);
        res.status(500).send('Error fetching field details');
    }

    function getField(response: AxiosResponse<any, any>) {
        const fields = response.data;

        for (const element of fields) {
            const foundField = element.fields.find((nested: { uuid: string; }) => nested.uuid === uuid);
            if (foundField)
                return foundField;
        }
    }
});

router.get('/sharing', async (req, res) => {
    const orgCode = req.query.orgCode as string;

    //We would need to log the user in to our system if they are not already logged in
    //We could then store the orgCode to the associated user
    if (orgCode) {
        try {
            const accessToken = session.accessToken;
            const response = await axios.put(`${session.dataServer}sharing/${orgCode}/confirm`, {}, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            console.log(response.data);
            res.status(200).send("Handshake Complete")
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send("Problem encountered during handshake with Panorama!");
        }
    } else {
        res.status(500).send("OrgCode not provided");
    }
})

export default router;