$(document).ready(function(){
    fetch_inputs();
    $('input[type="submit"]').on("click", add_new);
    $('.fa-sync-alt').on("click",function(){
        localStorage.clear();
        fetch_inputs();
    });
    // console.log(delete_buttons);
    // $('a.btn-danger').on("click", delete_input);
    get_dels();

    function get_dels(){
        let delete_buttons = document.querySelectorAll('a.btn-danger');
        delete_buttons.forEach(delete_button => {
            delete_button.addEventListener("click", function(){ delete_input(this.parentElement); });
            // delete_button.on("click", delete_input);
        });
    }

    function add_new(e){
        let sign = $('select :selected').val();
        let price = $('#user_amount').val();
        let name = $('#nameof').val();

        if(!validate_input(price,name)) return false;
        
        let user_input = {
            name_key: name,
            sign_key: sign,
            price_key: price
        }

        if(localStorage.getItem('user_inputs') === null){
            // Init array
            let user_inputs = [];
            // Add to array
            user_inputs.push(user_input);
            // Set to localStorage
            localStorage.setItem('user_inputs', JSON.stringify(user_inputs));
        } else {
            // Get user_inputs from localStorage
            let user_inputs = JSON.parse(localStorage.getItem('user_inputs'));
            // Add user_input to array
            user_inputs.push(user_input);
            // Re-set back to localStorage
            localStorage.setItem('user_inputs', JSON.stringify(user_inputs));
        }

        fetch_inputs();

        // console.log(price);
        // console.log(sign);
        

        $('select').prop('selectedIndex',0);
        $('input[type="number"]').val('');
        $('input[type="text"]').val('');
        
        e.preventDefault;
    }

    function fetch_inputs(){
        // Get bookmarks from localStorage
        let user_inputs = JSON.parse(localStorage.getItem('user_inputs'));
        // Get output id
        let expenses = $('#main .expenses').get(0); 
        let incomes =  $('#main .incomes').get(0);
        // console.log(expenses);
        // console.log(incomes);
        // Build output
        expenses.innerHTML = '<div class="tab tab_red text-center">expenses&nbsp;<i class="fas fa-minus"></i></div>';
        incomes.innerHTML = '<div class="tab tab_green text-center">incomes&nbsp;<i class="fas fa-plus"></i></div>';
        if(!user_inputs) return false;

        let balance = 0;

        user_inputs.forEach(user_input => {
            if(user_input.sign_key === "minus"){
                expenses.innerHTML +=   '<div class="eachone eachone_red my-2">' + 
                                        '<i class="fas fa-minus"></i>' +
                                        '<span class="name">' + user_input.name_key + '</span>' +
                                        '<span class="cost">' + user_input.price_key + '</span>' +
                                        '<a href="#" class="btn btn-danger"><i class="fas fa-trash-alt"></i></a>' + 
                                        '</div>';
                                        balance -= Number(user_input.price_key);
            } else {
                incomes.innerHTML +=   '<div class="eachone eachone_green my-2">' + 
                                        '<i class="fas fa-plus"></i>' +
                                        '<span class="name">' + user_input.name_key + '</span>' +
                                        '<span class="cost">' + user_input.price_key + '</span>' +
                                        '<a href="#" class="btn btn-danger"><i class="fas fa-trash-alt"></i></a>' + 
                                        '</div>';
                                        balance += Number(user_input.price_key);
            }
        });

        if(balance >= 0)
            $('.jumbotron .btn.price').css("background", "linear-gradient(to right bottom, #00b491ff, #00f7c7ff)");
        else
            $('.jumbotron .btn.price').css("background", "linear-gradient(to right bottom, #db004aff, #ff4b88ff)");
        
        $('.jumbotron .btn.price').get(0).innerHTML = balance + "$";

        get_dels();

        
    }

    function validate_input(val, name){
        if(!val || !name){
            alert("Fill in the inputs!");
            return false;
        }
        return true;
    }

    function delete_input(par){
        let name = par.getElementsByClassName("name").item(0).innerHTML;
        let cost = par.getElementsByClassName("cost").item(0).innerHTML;
        // console.log(name);
        // console.log(cost);
        // Get bookmarks from localStorage
        var user_inputs = JSON.parse(localStorage.getItem('user_inputs'));
        // Loop through the user_inputs
        if(user_inputs === null) return false;
        for(var i =0;i < user_inputs.length;i++){
          if(user_inputs[i].name_key === name && user_inputs[i].price_key === cost){
            // Remove from array
            user_inputs.splice(i, 1);
          }
        }
        // Re-set back to localStorage
        localStorage.setItem('user_inputs', JSON.stringify(user_inputs));
      
        // Re-fetch bookmarks
        fetch_inputs();
    }
});