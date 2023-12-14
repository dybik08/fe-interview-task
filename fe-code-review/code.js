const errorMessages = {
    missingPdfFile: 'Missing pdf file',
    missingRequiredInput: (missingInputTypes) => {
        return `Missing requried input (${missingInputTypes.reduce((acc, curr, index) => {
            const shouldAddComa = index > 0;
            return `${acc}${shouldAddComa ? ',' : ''}${curr}`
        },'') })`
    },
    getDebtCollectorsFailed: 'Failed to get debt collectors'
}

const statusMessages = {
    emailsAlreadySent: 'Emails already sent',
    doneSendingEmails: 'Done sending emails...'
}

const STATUS = {
    DONE: 'DONE'
}

const USER_ROLE = {
    ADVISOR: 'ADVISOR'
}

const PROJECTS = {
    INKASSO: 'inkasso'
}

/*
* remove logDebug code
* remove logInfo code
* remove not used variables
* error messages cleanup
* status messages cleanup
* introduce constants
* destructure variables
* remove commented code that has no "documentation" purpose
* revert condition and drop big if that is not needed
* */

app.post('/api/extract', upload.single('file'), async (req, res) => {
    if (req.body) {
        const {
            requestID, 
            project,
            idUser
        } = req.body
        
        const file = req.file;
        const user = await User.findOne(idUser);
        
        if(!requestID || !project || !idUser || !user) {
            return res.status(500).json({requestID, message: errorMessages.missingRequiredInput(["requestID", "project", "file"])});
        }

        if (user.role === USER_ROLE.ADVISOR || user.role.indexOf(USER_ROLE.ADVISOR) > -1) {
            //TODO: shouldn't it be a different status?
            return res.json({requestID, step: 999, status: STATUS.DONE, message: 'Nothing to do for ADVISOR role'});
        }

        /* reset status variables */
        await db.updateStatus(requestID, 1, '');

        if (project === PROJECTS.INKASSO && config.projects.hasOwnProperty(project) && file) {
            const hashSum = crypto.createHash('sha256'); // not used variable
            const fileHash = idUser;
            const fileName = 'fullmakt';
            const fileType = mime.getExtension(file.mimetype);

            if (fileType !== 'pdf') {
                return res.status(500).json({requestID, message: errorMessages.missingPdfFile});
            }

            await db.updateStatus(requestID, 3, '');

            const folder = `${project}-signed/${idUser}`;

            await uploadToGCSExact(folder, fileHash, fileName, fileType, file.mimetype, file.buffer);

            await db.updateStatus(requestID, 4, '');

            await db.updateUploadedDocs(idUser, requestID, fileName, fileType, file.buffer);

            await db.updateStatus(requestID, 5, '');

            const debtCollectors = await db.getDebtCollectors();

            if (!debtCollectors) {
                return res.status(500).json({requestID, message: errorMessages.getDebtCollectorsFailed});
            }

            if (!!(await db.hasUserRequestKey(idUser))) { //FIX: check age, not only if there's a request or not
                return res.json({requestID, step: 999, status: STATUS.DONE, message: statusMessages.emailsAlreadySent});
            }

            const sentStatus = {};

            // this big for should be split into smaller single-job chunks
            for (let i = 0; i < debtCollectors.length ; i++) {
                await db.updateStatus(requestID, 10+i, '');
                const idCollector = debtCollectors[i].id;
                const collectorName = debtCollectors[i].name;
                const collectorEmail = debtCollectors[i].email;
                const hashSum = crypto.createHash('sha256');
                const hashInput = `${idUser}-${idCollector}-${(new Date()).toISOString()}`;
                hashSum.update(hashInput);
                const requestKey = hashSum.digest('hex');

                const hash = Buffer.from(`${idUser}__${idCollector}`, 'utf8').toString('base64')

                if (!!(await db.setUserRequestKey(requestKey, idUser))
                    && !!(await db.setUserCollectorRequestKey(requestKey, idUser, idCollector))) {

                    /* prepare email */
                    const sendConfig = {
                        sender: config.projects[project].email.sender,
                        replyTo: config.projects[project].email.replyTo,
                        subject: 'Email subject',
                        templateId: config.projects[project].email.template.collector,
                        params: {
                            downloadUrl: `https://url.go/download?requestKey=${requestKey}&hash=${hash}`,
                            uploadUrl: `https://url.go/upload?requestKey=${requestKey}&hash=${hash}`,
                            confirmUrl: `https://url.go/confirm?requestKey=${requestKey}&hash=${hash}`
                        },
                        tags: ['request'],
                        to: [{ email: collectorEmail , name: collectorName }],
                    };

                    try {
                        await db.setEmailLog({collectorEmail, idCollector, idUser, requestKey})
                    } catch (e) {
                        // this should be return res.json with correct status
                        logDebug('extract() setEmailLog error=', e);
                    }

                    /* send email */
                    // possible undefined here
                    const resp = await email.send(sendConfig, config.projects[project].email.apiKey);

                    // update DB with result
                    await db.setUserCollectorRequestKeyRes(requestKey, idUser, idCollector, resp);

                    if (!sentStatus[collectorName])
                        sentStatus[collectorName] = {};
                    sentStatus[collectorName][collectorEmail] = resp;

                    if (!resp) {
                        // this should be return res.json with correct status
                        logError('extract() Sending email failed: ', resp);
                    }
                }
            }

            await db.updateStatus(requestID, 100, '');

            // 
            //if (!allSent)
            //return res.status(500).json({requestID, message: 'Failed sending email'});

            await db.updateStatus(requestID, 500, '');

            /* prepare summary email */
            const summaryConfig = {
                //bcc: [{ email: 'tomas@inkassoregisteret.com', name: 'Tomas' }],
                sender: config.projects[project].email.sender,
                replyTo: config.projects[project].email.replyTo,
                subject: 'Oppsummering Kravsforespørsel',
                templateId: config.projects[project].email.template.summary,
                params: {
                    collectors: sentStatus,
                },
                tags: ['summary'],
                to: [{ email: 'tomas@upscore.no' , name: 'Tomas' }], // FIXXX: config.projects[project].email.sender
            };

            /* send email */
            //const respSummary = await email.send(sendConfig, config.projects[project].email.apiKey);
            //logDebug('extract() summary resp=', respSummary);

            await db.updateStatus(requestID, 900, '');
        }
        
        await db.updateStatus(requestID, 999, '');

        return res.json({requestID, step: 999, status: STATUS.DONE, message: statusMessages.doneSendingEmails});

    }
    res.status(500).json({requestID: '', message: errorMessages.missingRequiredInput(["form data"])});
});