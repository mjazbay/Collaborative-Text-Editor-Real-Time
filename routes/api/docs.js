const express = require('express');
const router = express.Router();

//Load Docs Model //database model schema
const Docs = require('../../models/Docs'); 

const createNewDoc = ({name, docId, createdBy, editedBy, content}, res) => {
    const doc = new Docs({
        name,
        docId,
        createdBy,
        editedBy,
        content,
    });
    doc.save().then( function(succ, err) {
        if (succ) res.status(200).json({success: true, doc: succ});
        else res.status(500).json({success: false, error: `Couldn't save new document. ${err}`});
    }).catch(err => {
        res.status(500).json({success: false, error: `Couldn't save new document. ${err}`});
    });
}

router.post("/save/:docId", (req, res) => {
    console.log('debug requested to save doc ', req.body, ' n ', req.params);

    Docs.findOne({ docId: req.params.docId}, async (err, doc) => {
        if (err) {
            await createNewDoc(req.body,res);
        } else {
            if (doc) {
                doc.content = req.body.content.length <= 1 ? ' ' : req.body.content;
                doc.name = req.body.name;
                doc.editedBy = req.body.editedBy;
                doc.save().then((succ, err) => {
                    if (succ) res.status(200).json({success: true, doc: succ});
                    else res.status(500).json({success: false, error: `Couldn't update the document. ${err}`});
                }).catch(err => {
                    res.status(500).json({success: false, error: `Couldn't update the document. ${err}`});
                });
            } else {
               await createNewDoc(req.body,res);
            }
        }
    })
})

router.get("/get/:docId", function(req,res) {
    console.log('debug req res --> ', req.params);
    if (!req.params.docId) res.status(500).json({success: false, error: 'no doc ID'});
    Docs.findOne({docId: req.params.docId}, (err, doc) => {
        if (err) {
            return res.status(500).json({success: false, error: err });
        }
        else {
            if (doc) {
                res.status(200).json({success: true, doc });
            } else {
                return res.status(400).json({success: false, error: 'doc is empty or null' });
            }
        }
    })
});

//****************************** implementing AVA's parts ************************************************************
//************************************************************************************************************************
// ************************************************************************************************************************

router.get('/ping', (req,res) => {
    res.status(200).json({ok: true, msg: 'pong'})
})
router.get('/info', (req,res) => {
    res.status(200).json({
        ok: true,
        author: {
            email: "maksat_zhazbaev@utexas.edu",
            name: "Maksat Zhazbayev"
        },
        frontend: {
            url: "https://editorbymaksat.herokuapp.com/"
        },
        language: "node.js",
        sources: {
            frontend: "https://github.com/mzhazbay/Collaborative-Text-Editor-FrontEnd",
            backend: "https://github.com/mzhazbay/Collaborative-Text-Editor-Real-Time",
        },
        answers: {
            1: 
                `First tried to figure out how to add real-time to the app, instead of making http calls. Then researched little bit more about the operational transformation, but didn't succeed in that. After, I had to work more on the backend part since I mostly develop ui components and I had to pick up some concepts of server-side. Eventually I focused on front end and added some ui components to the app.`,
            2: "I would try implementing the autosave and the operational transformation",
            3: "More hints on the implementation parts. step-by-step guides."
        }
    })
})

router.post('/mutations', (req,res) => {
    res.status(200).json({
            msg: "didn't implement operational transformation algorithm, I use socket.io for real time",
            ok: true,
            text: "hello world"
    })
    // {
    //     "author": "alice | bob",
    //     "conversationId": "string",
    //     "data": {
    //       "index": "number",
    //       "length": "number | undefined",
    //       "text": "string | undefined",
    //       "type": "insert | delete"
    //     },
    //     "origin": {
    //       "alice": "integer",
    //       "bob": "integer"
    //     }
    //   }
})

router.get('/conversations', (req,res) => {
    Docs.find({}).exec((error, docs) => {
        if (error) res.status(500).json({success: false, error});
        else {
            if (docs) {
                res.status(200).json({
                    conversations: docs,
                    msg: `found error ${error}`,
                    ok: !error,
                })
            } else {
                if (error) res.status(500).json({success: false, error});
            }
        }
    })
})

router.delete('/conversations/:docId', (req,res) => {
    if (!(req.params.docId *1)) res.status(400).json({msg:'error docId is null or undefined', ok: false});
    Docs.findOneAndDelete({docId: req.params.docId}, (err, doc) => {
        console.log('debug delete request ', req.params.docId, err ,doc);
        if (err) res.status(400).json({msg:'error removing', ok: false});
        if (doc) res.status(204).json({//204 doesn't return content;
            msg: `error is ${err}`,
            ok: true,
        });
        else res.status(400).json({msg:'error removing', ok: false})
    })
})



module.exports = router;