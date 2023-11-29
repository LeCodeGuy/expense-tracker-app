export default function expenseTracker(query){

    // Helper functions
    function titleCase(str) {
        //keep track of the original string passed
        const originalStr = str;
        const regexHyphen = /-/
        str = str.toLowerCase().split(/\s|-/);

        for (var i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
        }

        if(regexHyphen.test(originalStr)=== true){
           str = str.join('-')
        }
        else{
            str = str.join(' ');
        }

        return str;
    }

    // TODO define and write methods to manage user inputs and get variables
    // TODO required by the services before making calls to the service
    async function home(req,res){

        let categoryData = await query.allCategories();
        let totalExpense = await query.totalExpense();
        let summaryData = await query.categoryTotals();

        res.render('home',{
            tabTitle:'Home - Expense Tracker App',
            pageTitle:'Expense Tracker App',
            categoryData,
            totalExpense,
            summaryData
        })
    }

    async function showExpenses(req, res){
        res.redirect('/expenses');
    }

    async function allExpenses(req, res){
        let allExpensesData = await query.allExpenses();

        res.render('expenses',{
            tabTitle:'Home - Expense Tracker App',
            pageTitle:'Expense Tracker App',
            allExpensesData
        })
    }

    async function returnHome(req,res){
        res.redirect('/');
    }

    // Ensure that the following conditions are met
    // Blank expenses are not allowed
    // A method is required to make all expenses sentence case for consistency
    
    // Expenses should be added to the expense table the following number of times:
    // Monthly and Once Off = 1x
    // Weekly = 4x
    // Weekday = 5x
    // Weekend = 2x
    // Daily = 30x

    return{
        // TODO return all the methods for use in the index.js file
        home,
        showExpenses,
        allExpenses,
        returnHome
    }
}