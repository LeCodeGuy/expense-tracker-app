// Expenses should be added to the expense table the following number of times:
// Monthly and Once Off = 1x
// Weekly = 4x
// Weekday = 5x
// Weekend = 2x
// Daily = 30x


// TODO add method to filter based on category selected,
// TODO this will be used on the all expenses page.

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

    async function home(req,res){

        let categoryData = await query.allCategories();
        let totalExpense = await query.totalExpense();
        let summaryData = await query.categoryTotals();

        res.render('home',{
            tabTitle:'Home - Expense Tracker App',
            pageTitle:'Expense Tracker App',
            categoryData,
            totalExpense,
            summaryData,
        })
    }

    async function addExpense(req,res){
        const regex = /^\s*$/;

        let expenseName = titleCase(req.body.txtExpense);
        let amount = req.body.txtAmount;
        let category = req.body.categories;

        if(regex.test(expenseName) && amount.length === 0){
            req.flash('error','Please add an expense name and amount greater than 0')
        }
        else{
            if(!regex.test(expenseName)){
                if(amount.length != 0){
                    await query.addExpense(expenseName,category,amount);
                    req.flash('success',expenseName,' added successfully');
                }
                else{
                    req.flash('error','Please enter an amount greater than 0');
                }
            }
            else{
                req.flash('error','Please enter an expense name');
            }
        }
        res.redirect('/');
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
    
    async function deleteExpense(req,res){
        await query.deleteExpense(req.params.expense,req.params.category);
        res.redirect('/expenses');
    }

    async function returnHome(req,res){
        res.redirect('/');
    }  

    return{
        home,
        addExpense,
        showExpenses,
        allExpenses,
        deleteExpense,
        returnHome
    }
}