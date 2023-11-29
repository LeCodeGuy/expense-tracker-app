// Import ExpressJS framework
import express from 'express';

// Import middleware
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import Modules
import queries from './services/expense-tracker-services.js';
import db from './sql/database-connection.js'
import expenseTrackerRoutes from './routes/expense-tracker-routes.js'

// Setup a simple ExpressJS server
const app = express();

// Load environment variables from .env file
dotenv.config();

// Use the 'helmet' middleware to set various HTTP headers for security
app.use(helmet());

// Initialise session middleware - flash-express depends on this don't let it down
app.use(session({
    secret : '<add a secret string here>',
    resave: false,
    saveUninitialized: true
  }));

// Initialise flash middleware
app.use(flash());

// Make public folder available to the app
app.use(express.static('public'));

// handlebar engine settings
const handlebarSetup = exphbs.engine({
    // Define custom helpers
    helpers: {
        eq: function (v1, v2) {
            return v1 === v2;
        },
        lte: function (v1, v2) {
            return v1 <= v2;
        },
        gte: function (v1, v2) {
            return v1 >= v2;
        },
        formatDecimal: function(v1) {
            return parseFloat(v1).toFixed(2);
        }
    },
    partialsDir: './views/partials',
    viewPath: './views',
    layoutsDir: './views/layouts'
})

// setup handlebars
app.engine('handlebars', handlebarSetup);
// set handlebars as the view engine
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
// parse application/json
app.use(bodyParser.json());

// Instantiate the app
let services = queries(db);
let routes = expenseTrackerRoutes(services);

// TODO define routes
// Routes
app.get('/', routes.home);

app.post('/showExpenses',routes.showExpenses);
app.post('/return',routes.returnHome);

app.get('/expenses', routes.allExpenses)

// Set PORT variable
let port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log('App starting on port', port);
});