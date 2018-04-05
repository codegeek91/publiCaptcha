$('form').submit(function(e){
    e.preventDefault();
    // Here goes validation
    //$('input[name="usingAJAX"]',this).val('true');
    // store reference to the form
    var $this = $(this);

    $('#submitBtn').attr('disabled', 'disabled');
    $('#submitBtn').html('<i class="material-icons">cached</i>');

    // grab the url from the form element
    var url = $this.attr('action');
    // prepare the form data to send
    var dataToSend = $this.serialize();
    // the callback function that tells us what the server-side process had to say
    var callback = function(data){
        // hide the form (thankfully we stored a reference to it)
        //$this.hide();
        if(data.success){
            $('#submitBtn').html('<i class="material-icons">done</i>');
            swal("OK!", "Tu URL coincide con un Ad de revo, todo OK", "success", {button: false, closeOnClickOutside: false});
            setTimeout(function() {
                window.location = '/';
            }, 2000);
        }else{
            if(data.reason == 'ADNOTEXIST'){
                swal("Oops!", "El anuncio que buscas no existe, revisa tu URL", "error", {button: false, closeOnClickOutside: false});
                setTimeout(function() {
                    window.location = '/';
                }, 2000);
            }
            else if(data.reason == 'ADALREADYEXIST'){
                swal("Oops!", "El anuncio ya fue insertado", "error", {button: false, closeOnClickOutside: false});
                setTimeout(function() {
                    window.location = '/';
                }, 2000);
            }
            else{
                swal("Oops!", "Estamos presentando problemas con el servidor, intenta más tarde.", "error", {button: false, closeOnClickOutside: false});
                setTimeout(function() {
                    window.location = '/';
                }, 2000);
            }
        }
        // in our case the server returned an HTML snippet so just append it to
        // the DOM
        // expecting: <div id="result">Your favorite food is pizza! Thanks for
        // telling us!</div>
        console.log(data);
    };
    // type of data to receive (in our case we're expecting an HTML snippet)
    var typeOfDataToReceive = 'json';
    // now send the form and wait to hear back
    $.post( url, dataToSend, callback, typeOfDataToReceive )
});