/**
 * users.js
 * These are example routes for user management
 * This shows how to correctly structure your routes for the project
 * and the suggested pattern for retrieving data by executing queries
 *
 * NB. it's better NOT to use arrow functions for callbacks with the SQLite library
* 
 */



const express = require("express");
const router = express.Router();


// ROUTES FOR THE AUTHOR PAGES

router.get("/author-home", (req, res, next) => {
    let draftsQuery = "SELECT * FROM draft_articles";
    let publishedArticlesQuery = "SELECT * FROM published_articles";

    // Execute the drafts query
    global.db.all(draftsQuery, function (err, drafts) {
        if (err) {
            next(err); // Send the error on to the error handler
        } else {
            // Execute the published articles query
            global.db.all(publishedArticlesQuery, function (err, publishedArticles) {
                if (err) {
                    next(err); // Send the error on to the error handler
                } else {
                    // Render page with both drafts and published articles
                    res.render("author-home.ejs", { drafts: drafts, publishedArticles: publishedArticles });
                }
            });
        }
    });
});



// ROUTES FOR THE DRAFT MANAGEMEN
// Route to PUBLISH DRAFT



// Route to UPDATE DRAFT 



// Route to DELETE DRAFT

// Route to display draft delete confirmation page 
router.get('/draft-delete/:draftId', (req, res, next) => {
    // SQL query to select the draft marked for deletion
    let query = "SELECT * FROM draft_articles WHERE article_id = ?"
    let draftId = req.params.draftId

    console.log(draftId)
    global.db.get(query, draftId, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.render('draft-delete.ejs', {draft: data})
        }
    })
})

// Route to submit or cancel draft deletion. 
router.post('/confirm-delete/:draftId', (req, res, next) => {
    // SQL query to delete the draft
    let query = "DELETE FROM draft_articles WHERE article_id = ?"
    let draftId = req.params.draftId

    global.db.run(query, draftId, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.redirect('http://localhost:3000/users/author-home')
        }
    })
})


// Route to display the new draft page
router.get("/new-draft", (req, res) => {
    res.render("new-draft");
});

// Route to handle saving a new draft
router.post("/new-draft", (req, res, next) => {
    // Define the query
    query = "INSERT INTO draft_articles (title, content, created, last_modified, user_id) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)";
    query_parameters = [req.body.title, req.body.content]
    
    // Execute the query and send a confirmation message
    global.db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.send("New data inserted!");
                next();
            }
        }
    );
});





















// FEATURES TO GET RID OF LATER

// GET route for list-users
router.get("/list-users", (req, res, next) => {
    // Define the query
    query = "SELECT * FROM users"

    // Execute the query and render the page with the results
    global.db.all(query, 
        function (err, rows) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.render("list-users.ejs", {users: rows}); // render page as simple json
            }
        }
    );
});

/**
 * @desc Displays a page with a form for creating a user record
 */
router.get("/add-user", (req, res) => {
    res.render("add-user.ejs");
});

/**
 * @desc Add a new user to the database based on data from the submitted form
 */
router.post("/add-user", (req, res, next) => {
    // Define the query
    query = "INSERT INTO users (user_name, email_address) VALUES( ?, ?);"
    query_parameters = [req.body.user_name, req.body.email_address]
    
    // Execute the query and send a confirmation message
    global.db.run(query, query_parameters,
        function (err) {
            if (err) {
                next(err); //send the error on to the error handler
            } else {
                res.redirect('http://localhost:3000/users/author-home');
                next();
            }
        }
    );
});

// EDIT USER 

router.get("/edit-user/:userId", (req, res, next) => {
    let userId = req.params.userId;
    // SQL query to fetch user details
    let query = "SELECT * FROM users WHERE user_id = ?";

    global.db.get(query, userId, (err, rows) => {
        if (err) {
            next(err); // Handle the error
        } else {
            res.render('edit-user.ejs', {rows: rows})// Render edit-user page
        }
    });
});

router.post("/edit-user/:userId", (req, res, next) => {
    // SQL query to update details and specify the params
    let query = "UPDATE users SET user_name = ? WHERE user_id = ?"
    let query_params = [req.body.user_name, req.body.user_id]
    
    // execute the query
    global.db.run(query, query_params, (err, change) => {
        if(err) {
            next(err); // Handle the error
        } else {
            res.redirect('http://localhost:3000/users/list-users')
        }
    })
});   

// DELETE USER 

router.get('/delete-user/:userId', (req, res, next) => {
    // SQL query to delete the user 
    let query = "SELECT * FROM users WHERE user_id = ?"
    let userId = req.params.userId

    global.db.get(query, userId, (err, user) => {
        if (err) {
            next(err); 
        } else {
            res.render('delete-user.ejs', {user: user})
        }
    })
});

router.post('/confirm-delete/:userId', (req, res, next) => {
    // SQL query to delete the user 
    let query = "DELETE FROM users WHERE user_id = ?;"
    query_params = req.params.userId

    global.db.run(query, query_params, (err, data) => {
        if (err) {
            next(err);
        } else {
            res.redirect('http://localhost:3000/users/list-users')
        }
    })
});

// Export the router object so index.js can access it
module.exports = router;
