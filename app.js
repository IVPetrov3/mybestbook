const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const path = require('path');
const { body, validationResult} = require('express-validator');
const users = [];

//Type in npm start to start the script. The script runs on localhost:3080 by default.



// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// Access files in public folder
app.use(express.static('public'));

//Home route
app.get('/', function(req, res) {
    res.render('index');
});

// Success page route
app.get('/submit', function(req, res) {
    res.render('successPage');
});

//Submit post request and validation

app.post('/submit', [
    body('name')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({min: 2})
        .withMessage('Name must be at least 2 characters.')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name can only contain letters.')
        .custom((value) => {
            if (value.includes(' and ')) {
                throw new Error('Only one name is allowed.');
            }
            return true;
        }),
], function (req, res) {
    const { name, gender } = req.body;
    const str = name;
    const name1 = str.charAt(0).toUpperCase() + str.slice(1);
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.render('index', {errors:errors.array()});
    } else {
        users.push({
            id: Date.now().toString(),
            name: name1,
            gender: req.body.gender
        });
        console.log(users)
        return res.render('successPage', { name1, gender });
        
    }
})

// Running port
const PORT = process.env.PORT || 3080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));